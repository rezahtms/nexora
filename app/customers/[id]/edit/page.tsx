import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CustomerForm from "@/components/pages/customers/CustomerForm";
import { routes } from "@/lib/constants/routes";
import { getServerCustomer } from "@/lib/utils/getServerCustomer";
import { parseCustomerId } from "@/lib/utils/parseCustomerId";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/customers/[id]/edit">): Promise<Metadata> {
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
    title: `Edit ${fullName}`,
    description: `Edit contact, company, and address details for ${fullName}.`,
    alternates: { canonical: `/customers/${customerId}/edit` },
    robots: { index: false, follow: false },
  };
}

export default async function EditCustomerPage({ params }: PageProps<"/customers/[id]/edit">) {
  const { id } = await params;
  const customerId = parseCustomerId(id);
  if (customerId === null) {
    notFound();
  }

  const customer = await getServerCustomer(customerId);
  if (!customer) {
    notFound();
  }

  const fullName = `${customer.firstName} ${customer.lastName}`;

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={routes.customers} />}>Customers</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={routes.customer(customerId)} />}>{fullName}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-6">
        <p className="text-sm font-medium text-primary">Customer profile</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Edit {fullName}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Update the customer record and keep their information accurate.
        </p>
      </header>

      <CustomerForm customer={customer} />
    </main>
  );
}
