"use client";

import type { QueryKey } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EMPTY_CUSTOMER_CACHE_CHANGES } from "@/lib/constants/config";
import { deleteCustomer } from "@/lib/services/customer/customer-delete.controller";
import { customerKeys } from "@/lib/services/customer/customer.keys";
import type { Customer, CustomerCacheChanges, CustomerPage } from "@/lib/types/customer.types";
import { removeCustomerFromPage } from "@/lib/utils/customer-cache";

type DeleteSnapshot = {
  changes: CustomerCacheChanges;
  lists: [QueryKey, CustomerPage | undefined][];
  details: [QueryKey, Customer | undefined][];
};

export default function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    scope: { id: "customer-writes" },
    mutationFn: (id: number) => deleteCustomer(id),
    onMutate: async (id): Promise<DeleteSnapshot> => {
      await queryClient.cancelQueries({ queryKey: customerKeys.all() });
      const snapshot: DeleteSnapshot = {
        changes:
          queryClient.getQueryData<CustomerCacheChanges>(customerKeys.cacheChanges()) ??
          EMPTY_CUSTOMER_CACHE_CHANGES,
        lists: queryClient.getQueriesData<CustomerPage>({ queryKey: customerKeys.lists() }),
        details: queryClient.getQueriesData<Customer>({ queryKey: customerKeys.details() }),
      };

      const deletedCustomer =
        snapshot.details
          .flatMap(([, customer]) => (customer ? [customer] : []))
          .find((customer) => customer.id === id) ??
        snapshot.lists
          .flatMap(([, page]) => page?.users ?? [])
          .find((customer) => customer.id === id) ??
        snapshot.changes.created.find((customer) => customer.id === id);

      const nextChanges: CustomerCacheChanges = {
        ...snapshot.changes,
        updated: deletedCustomer
          ? { ...snapshot.changes.updated, [id]: deletedCustomer }
          : snapshot.changes.updated,
        deleted: [...new Set([...snapshot.changes.deleted, id])],
      };

      queryClient.setQueryData(customerKeys.cacheChanges(), nextChanges);
      queryClient.setQueriesData<CustomerPage>({ queryKey: customerKeys.lists() }, (page) =>
        page ? removeCustomerFromPage(page, id) : page,
      );
      queryClient.removeQueries({ queryKey: customerKeys.detail(id), exact: true });

      return snapshot;
    },
    onError: (_error, _variables, snapshot) => {
      if (!snapshot) return;
      queryClient.setQueryData(customerKeys.cacheChanges(), snapshot.changes);
      snapshot.lists.forEach(([key, value]) => queryClient.setQueryData(key, value));
      snapshot.details.forEach(([key, value]) => queryClient.setQueryData(key, value));
    },
  });
}
