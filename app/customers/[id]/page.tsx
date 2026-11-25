import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import CustomerProfile from "@/components/pages/customers/customer-profile";
import { getQueryClient } from "@/lib/providers/get-query-client";
import { getServerCustomer } from "@/lib/utils/get-server-customer";
import { parseCustomerId } from "@/lib/utils/parse-customer-id";
import { requireServerCustomer } from "@/lib/utils/require-server-customer";

export async function generateMetadata({ params }: PageProps<"/customers/[id]">): Promise<Metadata> {
  const { id } = await params;
  const customerId = parseCustomerId(id);
  if (customerId === null) {
    return { title: "Customer not found", robots: { index: false } };
  }
  const customer = await getServerCustomer(customerId);
  if (!customer) {
    return { title: "Customer not found", robots: { index: false } };
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
  await requireServerCustomer(id);
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CustomerProfile />
    </HydrationBoundary>
  );
}
