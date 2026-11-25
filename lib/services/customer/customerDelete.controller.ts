import type { QueryKey } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendRequest } from "@/lib/configs/request";
import { EMPTY_CUSTOMER_CACHE_CHANGES } from "@/lib/constants/config";
import { customerKeys } from "@/lib/services/customer/customer.keys";
import type { Customer, CustomerCacheChanges, CustomerDeleteResponse, CustomerPage } from "@/lib/types/customer.types";
import { removeCustomerFromPage } from "@/lib/utils/customerCache";

export async function deleteCustomer(id: number): Promise<CustomerDeleteResponse> {
  return sendRequest<CustomerDeleteResponse>({
    method: "delete",
    url: `/users/${id}`,
  });
}

type DeleteSnapshot = {
  changes: CustomerCacheChanges;
  lists: [QueryKey, CustomerPage | undefined][];
  details: [QueryKey, Customer | undefined][];
};

function isCacheOnlyCustomer(id: number, changes: CustomerCacheChanges): boolean {
  return changes.created.some((customer) => customer.id === id) || id > 208;
}

export default function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    scope: { id: "customer-writes" },
    mutationFn: async (id: number) => {
      const changes =
        queryClient.getQueryData<CustomerCacheChanges>(customerKeys.cacheChanges()) ??
        EMPTY_CUSTOMER_CACHE_CHANGES;
      if (isCacheOnlyCustomer(id, changes)) {
        return { id, isDeleted: true, deletedOn: new Date().toISOString() };
      }
      return deleteCustomer(id);
    },
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
      if (!snapshot) {
        return;
      }
      queryClient.setQueryData(customerKeys.cacheChanges(), snapshot.changes);
      snapshot.lists.forEach(([key, value]) => queryClient.setQueryData(key, value));
      snapshot.details.forEach(([key, value]) => queryClient.setQueryData(key, value));
    },
  });
}
