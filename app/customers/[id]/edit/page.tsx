"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { UserRoundX } from "lucide-react";
import CustomerForm from "@/components/pages/customers/CustomerForm";
import { routes } from "@/lib/constants/routes";
import useCustomer from "@/lib/services/customer/customerDetail.controller";
import useCustomerId from "@/lib/hooks/useCustomerId";

export default function EditCustomerPage() {
  const id = useCustomerId();
  const customerQuery = useCustomer(id);
  const customer = customerQuery.data;

  if (id === null || customerQuery.isNotFound) {
    return (
      <main id="main-content" className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <Empty className="mt-8 border border-dashed py-14">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UserRoundX aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>Customer not found</EmptyTitle>
            <EmptyDescription>
              This customer may have been removed or the address may be incorrect.
            </EmptyDescription>
          </EmptyHeader>
          <Button variant="outline" nativeButton={false} render={<Link href={routes.customers} />}>
            Back to customers
          </Button>
        </Empty>
      </main>
    );
  }

  if (customerQuery.isLoading || !customer) {
    return (
      <main id="main-content" className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div
          className="flex min-h-40 items-center justify-center gap-3 text-sm font-medium text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          <Spinner />
          <span>Loading customer information</span>
        </div>
      </main>
    );
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
            <BreadcrumbLink render={<Link href={routes.customer(customer.id)} />}>
              {fullName}
            </BreadcrumbLink>
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
