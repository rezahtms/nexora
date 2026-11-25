import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import AddCustomerButton from "@/components/pages/customers/AddCustomerButton";
import CustomerList from "@/components/pages/customers/CustomerList";
import { getQueryClient } from "@/lib/providers/getQueryClient";
import { customersQueryOptions } from "@/lib/services/customer/customer.options";
import { parseCustomerListParams } from "@/lib/utils/parseCustomerListParams";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Customers",
    description: "Search, organize, and manage customer relationships in Nexora CRM.",
    alternates: { canonical: "/customers" },
    openGraph: {
      title: "Customers | Nexora CRM",
      description: "Search, organize, and manage customer relationships in Nexora CRM.",
    },
  };
}

export default async function CustomersPage({ searchParams }: PageProps<"/customers">) {
  const values = await searchParams;
  const params = parseCustomerListParams(values);
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(customersQueryOptions(params));

  return (
    <main id="main-content" className="mx-auto w-full max-w-7xl px-4 pb-16 pt-9 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Customer workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Customers</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Manage the relationships that make your business grow.
          </p>
        </div>
        <AddCustomerButton />
      </header>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CustomerList />
      </HydrationBoundary>
    </main>
  );
}
