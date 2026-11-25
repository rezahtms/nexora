import { notFound } from "next/navigation";
import type { Customer } from "@/lib/types/customer.types";
import type { SearchParamValue } from "@/lib/types/route.types";
import { getServerCustomer } from "@/lib/utils/get-server-customer";
import { parseCustomerId } from "@/lib/utils/parse-customer-id";

export async function requireServerCustomer(rawId: SearchParamValue): Promise<Customer> {
  const customerId = parseCustomerId(rawId);
  if (customerId === null) notFound();
  const customer = await getServerCustomer(customerId);
  if (!customer) notFound();
  return customer;
}
