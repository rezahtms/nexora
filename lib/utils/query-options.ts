import { cache } from "react";
import type { QueryClient, QueryFunctionContext } from "@tanstack/react-query";
import { getUser, getUsers, searchUsers } from "@/lib/api/generated/users/users";
import { CUSTOMER_PAGE_SIZE, QUERY_STALE_TIME } from "@/lib/constants/config";
import { queryKeys } from "@/lib/constants/query-keys";
import { EMPTY_SESSION_CHANGES } from "@/lib/constants/config";
import type { Customer, CustomerListParams, CustomerPage, SessionChanges } from "@/lib/types/customer.types";

const getCustomerForRequest = cache((id: number) => getUser(id));

export function customerListQueryOptions(params: CustomerListParams) {
  return {
    queryKey: queryKeys.customers.list(params),
    queryFn: ({ signal }: QueryFunctionContext) => fetchCustomerPage(params, signal),
    staleTime: QUERY_STALE_TIME,
  };
}

export function customerDetailQueryOptions(id: number, client?: QueryClient) {
  return {
    queryKey: queryKeys.customers.detail(id),
    queryFn: ({ signal }: QueryFunctionContext) => fetchCustomer(id, signal, client),
    staleTime: QUERY_STALE_TIME,
  };
}

export async function fetchCustomerPage(params: CustomerListParams, signal?: AbortSignal): Promise<CustomerPage> {
  const limit = params.limit || CUSTOMER_PAGE_SIZE;
  const skip = (params.page - 1) * limit;
  if (!params.q.trim()) {
    return getUsers({ limit, skip, sortBy: params.sortBy, order: params.order }, signal);
  }
  const result = await searchUsers({ q: params.q.trim(), limit: 0, skip: 0, sortBy: params.sortBy, order: params.order }, signal);
  const users = result.users
    .filter((customer) => `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(params.q.trim().toLowerCase()))
    .sort((left, right) => {
      const leftName = `${left.firstName} ${left.lastName}`.toLowerCase();
      const rightName = `${right.firstName} ${right.lastName}`.toLowerCase();
      const comparison = leftName < rightName ? -1 : leftName > rightName ? 1 : 0;
      return params.order === "asc" ? comparison : -comparison;
    });
  return { ...result, users: users.slice(skip, skip + limit), total: users.length, skip, limit };
}

export async function fetchCustomer(id: number, signal?: AbortSignal, client?: QueryClient): Promise<Customer> {
  const changes = client?.getQueryData<SessionChanges>(queryKeys.customers.session()) ?? EMPTY_SESSION_CHANGES;
  if (changes.deleted.includes(id)) throw new Error("CUSTOMER_NOT_FOUND");
  const local = changes.updated[id] ?? changes.created.find((customer) => customer.id === id);
  if (local) return local;
  return typeof window === "undefined" ? getCustomerForRequest(id) : getUser(id, signal);
}
