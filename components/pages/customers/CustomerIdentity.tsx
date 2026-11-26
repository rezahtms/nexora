"use client";

import CustomerAvatar from "@/components/pages/customers/CustomerAvatar";
import useCustomer from "@/lib/services/customer/customerDetail.controller";
import useCustomerId from "@/lib/hooks/useCustomerId";

export default function CustomerIdentity() {
  const id = useCustomerId();
  const customerQuery = useCustomer(id);
  const customer = customerQuery.data;

  if (!customer) {
    return (
      <div className="min-h-20">
        <p className="text-sm font-medium text-primary">Customer profile</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Customer profile</h1>
        <p className="mt-2 text-sm text-muted-foreground" role="status" aria-live="polite">
          {customerQuery.isNotFound ? "Customer not found" : "Loading customer details"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 sm:gap-5">
      <CustomerAvatar customer={customer} size="lg" />
      <div>
        <p className="text-sm font-medium text-primary">Customer profile</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {customer.firstName} {customer.lastName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {customer.company.title || "Customer"} at {customer.company.name}
        </p>
      </div>
    </div>
  );
}
