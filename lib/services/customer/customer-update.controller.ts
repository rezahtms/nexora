import { sendRequest } from "@/lib/configs/request";
import type { Customer, CustomerInput, CustomerUpdateRequest } from "@/lib/types/customer.types";

export async function updateCustomer(request: CustomerUpdateRequest): Promise<Customer> {
  return sendRequest<Customer, CustomerInput>({
    method: "put",
    url: `/users/${request.id}`,
    body: request.input,
  });
}
