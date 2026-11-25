import { sendRequest } from "@/lib/configs/request";
import type { Customer } from "@/lib/types/customer.types";

export async function getCustomerDetail(id: number, signal?: AbortSignal): Promise<Customer> {
  return sendRequest<Customer>({
    method: "get",
    url: `/users/${id}`,
    signal,
  });
}
