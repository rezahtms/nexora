"use client";

import type { QueryKey } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EMPTY_CUSTOMER_CACHE_CHANGES } from "@/lib/constants/config";
import { updateCustomer } from "@/lib/services/customer/customer-update.controller";
import { customerKeys } from "@/lib/services/customer/customer.keys";
import type {
  Customer,
  CustomerCacheChanges,
  CustomerPage,
  CustomerUpdateRequest,
} from "@/lib/types/customer.types";
import { applyCustomerUpdate } from "@/lib/utils/customer-cache";

type UpdateSnapshot = {
  changes: CustomerCacheChanges;
  lists: [QueryKey, CustomerPage | undefined][];
  details: [QueryKey, Customer | undefined][];
};

export default function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    scope: { id: "customer-writes" },
    mutationFn: (request: CustomerUpdateRequest) => updateCustomer(request),
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

      if (!existing) return snapshot;

      const updated: Customer = {
        ...existing,
        ...input,
        company: {
          ...existing.company,
          ...input.company,
          address: { ...existing.company.address, ...input.company?.address },
        },
        address: { ...existing.address, ...input.address },
      };

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
      if (!snapshot) return;
      queryClient.setQueryData(customerKeys.cacheChanges(), snapshot.changes);
      snapshot.lists.forEach(([key, value]) => queryClient.setQueryData(key, value));
      snapshot.details.forEach(([key, value]) => queryClient.setQueryData(key, value));
    },
    onSuccess: (response, variables) => {
      const current =
        queryClient.getQueryData<CustomerCacheChanges>(customerKeys.cacheChanges()) ??
        EMPTY_CUSTOMER_CACHE_CHANGES;
      const optimistic = current.updated[variables.id];
      const merged: Customer = optimistic ? { ...response, ...optimistic } : response;

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
