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
import CustomerDetail from "@/components/pages/customers/CustomerDetail";
import CustomerDetailActions from "@/components/pages/customers/CustomerDetailActions";
import CustomerIdentity from "@/components/pages/customers/CustomerIdentity";
import useBackToCustomersHref from "@/lib/hooks/useBackToCustomersHref";

export default function CustomerProfile() {
  const backHref = useBackToCustomersHref();

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={backHref} />}>Customers</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Customer profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <header className="flex flex-col gap-5 rounded-3xl border border-border/80 bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <CustomerIdentity />
        <CustomerDetailActions />
      </header>
      <CustomerDetail />
    </main>
  );
}
