import { sendRequest } from "@/lib/configs/request";
import type { Customer, CustomerInput } from "@/lib/types/customer.types";

export async function createCustomer(body: CustomerInput): Promise<Customer> {
  return sendRequest<Customer, CustomerInput>({
    method: "post",
    url: "/users/add",
    body,
  });
}
