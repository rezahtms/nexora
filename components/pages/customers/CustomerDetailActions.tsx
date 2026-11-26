"use client";

import CustomerActions from "@/components/pages/customers/CustomerActions";
import useCustomer from "@/lib/services/customer/customerDetail.controller";
import useCustomerId from "@/lib/hooks/useCustomerId";

export default function CustomerDetailActions() {
  const id = useCustomerId();
  const customerQuery = useCustomer(id);
  if (!customerQuery.data) return null;
  return <CustomerActions customer={customerQuery.data} />;
}
