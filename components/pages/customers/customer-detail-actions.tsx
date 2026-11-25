"use client";

import CustomerActions from "@/components/pages/customers/customer-actions";
import useCustomer from "@/lib/hooks/use-customer";

export default function CustomerDetailActions({ id }: { id: number }) {
  const customerQuery = useCustomer(id);
  if (!customerQuery.data) return null;
  return <CustomerActions customer={customerQuery.data} />;
}
