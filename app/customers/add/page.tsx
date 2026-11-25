import CustomerForm from "@/components/pages/customers/CustomerForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { routes } from "@/lib/constants/routes";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Add customer",
  description: "Add a new customer to your Nexora CRM workspace.",
  alternates: { canonical: "/customers/add" },
  robots: { index: false, follow: false },
};

export default function NewCustomerPage() {
  return (
    <main
      id="main-content"
      className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8"
    >
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={routes.customers} />}>
              Customers
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add customer</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-6">
        <p className="text-sm font-medium text-primary">Customer workspace</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Add customer
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Create a new customer record with contact, company, and address
          details.
        </p>
      </header>

      <CustomerForm />
    </main>
  );
}
