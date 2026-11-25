"use client";

import CustomerActions from "@/components/pages/customers/customer-actions";
import useCustomer from "@/lib/hooks/use-customer";
import useCustomerId from "@/lib/hooks/use-customer-id";

export default function CustomerDetailActions() {
  const id = useCustomerId();
  const customerQuery = useCustomer(id);
  if (!customerQuery.data) return null;
  return <CustomerActions customer={customerQuery.data} />;
}
