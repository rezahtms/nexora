import type { Metadata } from "next";
import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import CustomerProfile from "@/components/pages/customers/customer-profile";
import { getQueryClient } from "@/lib/providers/get-query-client";
import { customerDetailQueryOptions } from "@/lib/utils/query-options";
import { fetchCustomer } from "@/lib/utils/query-options";

type CustomerSearchParams = Awaited<PageProps<"/customers/[id]">["searchParams"]>;

export async function generateMetadata({ params }: PageProps<"/customers/[id]">): Promise<Metadata> {
  const { id } = await params;
  const customerId = Number(id);
  if (!Number.isSafeInteger(customerId) || customerId < 1) return { title: "Customer not found" };
  const sessionIds = readSessionIds((await cookies()).get("nexora-customer-session")?.value);
  if (sessionIds.deleted.includes(String(customerId))) return { title: "Customer not found", description: "This customer is no longer available." };
  if (sessionIds.created.includes(String(customerId))) return { title: "Customer profile", description: "Customer information in Nexora CRM." };
  try {
    const customer = await fetchCustomer(customerId);
    const fullName = `${customer.firstName} ${customer.lastName}`;
    return {
      title: fullName,
      description: `View contact, address, and company details for ${fullName}.`,
      alternates: { canonical: `/customers/${customerId}` },
      openGraph: { title: `${fullName} | Nexora CRM`, description: `Customer profile for ${fullName}.` },
    };
  } catch {
    return { title: "Customer profile", description: "Customer information in Nexora CRM." };
  }
}

export default async function CustomerPage({ params, searchParams }: PageProps<"/customers/[id]">) {
  const [{ id }, values] = await Promise.all([params, searchParams]);
  const customerId = Number(id);
  if (!Number.isSafeInteger(customerId) || customerId < 1) notFound();
  const sessionIds = readSessionIds((await cookies()).get("nexora-customer-session")?.value);
  if (sessionIds.deleted.includes(String(customerId))) notFound();
  const isSessionCustomer = sessionIds.created.includes(String(customerId));
  const queryString = serializeSearchParams(values);
  const backHref = `/customers${queryString ? `?${queryString}` : ""}`;
  const queryClient = getQueryClient();
  try {
    if (!isSessionCustomer) await queryClient.fetchQuery(customerDetailQueryOptions(customerId, queryClient));
  } catch (error: unknown) {
    if (isNotFoundError(error)) notFound();
    throw error;
  }
  return <HydrationBoundary state={dehydrate(queryClient)}><CustomerProfile id={customerId} backHref={backHref} /></HydrationBoundary>;
}

function serializeSearchParams(values: CustomerSearchParams): string {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
    else if (value !== undefined) params.set(key, value);
  });
  return params.toString();
}

function readSessionIds(value?: string): { created: string[]; deleted: string[] } {
  const [createdPart = "c:", deletedPart = "d:"] = value?.split("|") ?? [];
  return {
    created: createdPart.startsWith("c:") ? createdPart.slice(2).split(",").filter(Boolean) : [],
    deleted: deletedPart.startsWith("d:") ? deletedPart.slice(2).split(",").filter(Boolean) : [],
  };
}

function isNotFoundError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  if ("status" in error && error.status === 404) return true;
  return error instanceof Error && error.message === "CUSTOMER_NOT_FOUND";
}
