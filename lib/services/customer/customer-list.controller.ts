import { sendRequest } from "@/lib/configs/request";
import { CUSTOMER_PAGE_SIZE } from "@/lib/constants/config";
import type {
  CustomerApiListParams,
  CustomerApiSearchParams,
  CustomerListParams,
  CustomerPage,
} from "@/lib/types/customer.types";

export async function getCustomerList(
  params: CustomerListParams,
  signal?: AbortSignal,
): Promise<CustomerPage> {
  const limit = params.limit || CUSTOMER_PAGE_SIZE;
  const skip = (params.page - 1) * limit;
  const trimmedQuery = params.q.trim();

  if (!trimmedQuery) {
    return sendRequest<CustomerPage, undefined, CustomerApiListParams>({
      method: "get",
      url: "/users",
      params: { limit, skip, sortBy: params.sortBy, order: params.order },
      signal,
    });
  }

  const result = await sendRequest<CustomerPage, undefined, CustomerApiSearchParams>({
    method: "get",
    url: "/users/search",
    params: { q: trimmedQuery, limit: 0, skip: 0, sortBy: params.sortBy, order: params.order },
    signal,
  });

  const normalizedQuery = trimmedQuery.toLowerCase();
  const filtered = result.users
    .filter((customer) =>
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(normalizedQuery),
    )
    .sort((left, right) => {
      const leftName = `${left.firstName} ${left.lastName}`.toLowerCase();
      const rightName = `${right.firstName} ${right.lastName}`.toLowerCase();
      const comparison = leftName < rightName ? -1 : leftName > rightName ? 1 : 0;
      return params.order === "asc" ? comparison : -comparison;
    });

  return {
    ...result,
    users: filtered.slice(skip, skip + limit),
    total: filtered.length,
    skip,
    limit,
  };
}
