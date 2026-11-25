import { sendRequest } from "@/lib/configs/request";
import type { CustomerDeleteResponse } from "@/lib/types/customer.types";

export async function deleteCustomer(id: number): Promise<CustomerDeleteResponse> {
  return sendRequest<CustomerDeleteResponse>({
    method: "delete",
    url: `/users/${id}`,
  });
}
