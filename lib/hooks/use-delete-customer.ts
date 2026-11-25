"use client";

import { useCallback } from "react";
import type { QueryKey } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteUser } from "@/lib/api/generated/users/users";
import { queryKeys } from "@/lib/constants/query-keys";
import type { Customer, CustomerPage, SessionChanges } from "@/lib/types/customer.types";
import { removeCustomer } from "@/lib/utils/customer-session";
import { saveSessionChanges } from "@/lib/utils/session-storage";

type Snapshot = { session: SessionChanges; lists: [QueryKey, CustomerPage | undefined][]; details: [QueryKey, Customer | undefined][] };

export default function useDeleteCustomer() {
  const queryClient = useQueryClient();
  const mutation = useDeleteUser({
    mutation: {
      scope: { id: "customer-writes" },
      onMutate: async ({ id }): Promise<Snapshot> => {
        await queryClient.cancelQueries({ queryKey: queryKeys.customers.all });
        const snapshot: Snapshot = {
          session: queryClient.getQueryData<SessionChanges>(queryKeys.customers.session()) ?? { created: [], updated: {}, deleted: [] },
          lists: queryClient.getQueriesData<CustomerPage>({ queryKey: queryKeys.customers.lists() }),
          details: queryClient.getQueriesData<Customer>({ queryKey: ["customers", "detail"] }),
        };
        const deletedCustomer = snapshot.details.flatMap(([, customer]) => customer ? [customer] : []).find((customer) => customer.id === id)
          ?? snapshot.lists.flatMap(([, page]) => page?.users ?? []).find((customer) => customer.id === id)
          ?? snapshot.session.created.find((customer) => customer.id === id);
        const changes = {
          ...snapshot.session,
          updated: deletedCustomer ? { ...snapshot.session.updated, [id]: deletedCustomer } : snapshot.session.updated,
          deleted: [...new Set([...snapshot.session.deleted, id])],
        };
        saveSessionChanges(queryClient, changes);
        queryClient.setQueriesData<CustomerPage>({ queryKey: queryKeys.customers.lists() }, (page) => page ? removeCustomer(page, id) : page);
        queryClient.removeQueries({ queryKey: queryKeys.customers.detail(id), exact: true });
        return snapshot;
      },
      onError: (_error, _variables, snapshot) => {
        if (!snapshot) return;
        saveSessionChanges(queryClient, snapshot.session);
        snapshot.lists.forEach(([key, value]) => queryClient.setQueryData(key, value));
        snapshot.details.forEach(([key, value]) => queryClient.setQueryData(key, value));
      },
      onSettled: async (_data, _error, variables) => {
        await queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
        queryClient.removeQueries({ queryKey: queryKeys.customers.detail(variables.id), exact: true });
      },
    },
  });
  const generatedMutateAsync = mutation.mutateAsync;
  const mutateAsync = useCallback((id: number) => generatedMutateAsync({ id }), [generatedMutateAsync]);
  return { ...mutation, mutateAsync };
}
