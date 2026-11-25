import type { QueryKey } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendRequest } from "@/lib/configs/request";
import { EMPTY_CUSTOMER_CACHE_CHANGES } from "@/lib/constants/config";
import { customerKeys } from "@/lib/services/customer/customer.keys";
import type {
  Customer,
  CustomerCacheChanges,
  CustomerInput,
  CustomerPage,
  CustomerUpdateRequest,
} from "@/lib/types/customer.types";
import { applyCustomerUpdate } from "@/lib/utils/customerCache";

export async function updateCustomer(request: CustomerUpdateRequest): Promise<Customer> {
  return sendRequest<Customer, CustomerInput>({
    method: "put",
    url: `/users/${request.id}`,
    body: request.input,
  });
}

type UpdateSnapshot = {
  changes: CustomerCacheChanges;
  lists: [QueryKey, CustomerPage | undefined][];
  details: [QueryKey, Customer | undefined][];
};

function isCacheOnlyCustomer(id: number, changes: CustomerCacheChanges): boolean {
  return changes.created.some((customer) => customer.id === id) || id > 208;
}

function mergeCustomer(existing: Customer, input: CustomerUpdateRequest["input"]): Customer {
  return {
    ...existing,
    ...input,
    firstName: input.firstName ?? existing.firstName,
    lastName: input.lastName ?? existing.lastName,
    email: input.email ?? existing.email,
    phone: input.phone ?? existing.phone,
    image: input.image ?? existing.image,
    address: { ...existing.address, ...input.address },
    company: {
      ...existing.company,
      ...input.company,
      address: { ...existing.company.address, ...input.company?.address },
    },
  };
}

export default function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    scope: { id: "customer-writes" },
    mutationFn: async (request: CustomerUpdateRequest) => {
      const changes =
        queryClient.getQueryData<CustomerCacheChanges>(customerKeys.cacheChanges()) ??
        EMPTY_CUSTOMER_CACHE_CHANGES;
      if (isCacheOnlyCustomer(request.id, changes)) {
        const existing =
          queryClient.getQueryData<Customer>(customerKeys.detail(request.id)) ??
          changes.created.find((customer) => customer.id === request.id) ??
          changes.updated[request.id];
        if (existing) {
          return mergeCustomer(existing, request.input);
        }
      }
      return updateCustomer(request);
    },
    onMutate: async ({ id, input }): Promise<UpdateSnapshot> => {
      await queryClient.cancelQueries({ queryKey: customerKeys.all() });
      const snapshot: UpdateSnapshot = {
        changes:
          queryClient.getQueryData<CustomerCacheChanges>(customerKeys.cacheChanges()) ??
          EMPTY_CUSTOMER_CACHE_CHANGES,
        lists: queryClient.getQueriesData<CustomerPage>({ queryKey: customerKeys.lists() }),
        details: queryClient.getQueriesData<Customer>({ queryKey: customerKeys.details() }),
      };

      const existing =
        queryClient.getQueryData<Customer>(customerKeys.detail(id)) ??
        snapshot.lists
          .flatMap(([, page]) => page?.users ?? [])
          .find((item) => item.id === id) ??
        snapshot.changes.created.find((item) => item.id === id);

      if (!existing) {
        return snapshot;
      }

      const updated = mergeCustomer(existing, input);

      queryClient.setQueryData<CustomerCacheChanges>(customerKeys.cacheChanges(), {
        ...snapshot.changes,
        updated: { ...snapshot.changes.updated, [id]: updated },
      });
      queryClient.setQueriesData<CustomerPage>({ queryKey: customerKeys.lists() }, (page) =>
        page ? applyCustomerUpdate(page, updated) : page,
      );
      queryClient.setQueryData(customerKeys.detail(id), updated);

      return snapshot;
    },
    onError: (_error, _variables, snapshot) => {
      if (!snapshot) {
        return;
      }
      queryClient.setQueryData(customerKeys.cacheChanges(), snapshot.changes);
      snapshot.lists.forEach(([key, value]) => queryClient.setQueryData(key, value));
      snapshot.details.forEach(([key, value]) => queryClient.setQueryData(key, value));
    },
    onSuccess: (response, variables) => {
      const current =
        queryClient.getQueryData<CustomerCacheChanges>(customerKeys.cacheChanges()) ??
        EMPTY_CUSTOMER_CACHE_CHANGES;
      const merged = mergeCustomer(response, current.updated[variables.id] ?? {});

      queryClient.setQueryData<CustomerCacheChanges>(customerKeys.cacheChanges(), {
        ...current,
        updated: { ...current.updated, [variables.id]: merged },
      });
      queryClient.setQueriesData<CustomerPage>({ queryKey: customerKeys.lists() }, (page) =>
        page ? applyCustomerUpdate(page, merged) : page,
      );
      queryClient.setQueryData(customerKeys.detail(variables.id), merged);
    },
  });
}
