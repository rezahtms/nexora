import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import CustomerProfile from "@/components/pages/customers/CustomerProfile";
import { getQueryClient } from "@/lib/providers/getQueryClient";
import { getServerCustomer } from "@/lib/utils/getServerCustomer";
import { parseCustomerId } from "@/lib/utils/parseCustomerId";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/customers/[id]">): Promise<Metadata> {
  const { id } = await params;
  const customerId = parseCustomerId(id);
  if (customerId === null) {
    return { title: "Customer not found", robots: { index: false, follow: false } };
  }
  const customer = await getServerCustomer(customerId);
  if (!customer) {
    return { title: "Customer not found", robots: { index: false, follow: false } };
  }
  const fullName = `${customer.firstName} ${customer.lastName}`;
  return {
    title: fullName,
    description: `View contact, address, and company details for ${fullName}.`,
    alternates: { canonical: `/customers/${customerId}` },
    openGraph: {
      title: `${fullName} | Nexora CRM`,
      description: `Customer profile for ${fullName}.`,
    },
  };
}

export default async function CustomerPage({ params }: PageProps<"/customers/[id]">) {
  const { id } = await params;
  const customerId = parseCustomerId(id);
  if (customerId === null) {
    notFound();
  }
  await getServerCustomer(customerId);
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CustomerProfile />
    </HydrationBoundary>
  );
}
