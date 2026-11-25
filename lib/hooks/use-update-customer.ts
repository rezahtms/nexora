"use client";

import { useCallback } from "react";
import type { QueryKey } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateUser } from "@/lib/api/generated/users/users";
import { queryKeys } from "@/lib/constants/query-keys";
import type { Customer, CustomerInput, CustomerPage, SessionChanges } from "@/lib/types/customer.types";
import { applyCustomerUpdate } from "@/lib/utils/customer-session";
import { saveSessionChanges } from "@/lib/utils/session-storage";

type Snapshot = { session: SessionChanges; lists: [QueryKey, CustomerPage | undefined][]; details: [QueryKey, Customer | undefined][] };

export default function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const mutation = useUpdateUser({
    mutation: {
      scope: { id: "customer-writes" },
      onMutate: async ({ id, data }): Promise<Snapshot> => {
        await queryClient.cancelQueries({ queryKey: queryKeys.customers.all });
        const snapshot: Snapshot = {
          session: queryClient.getQueryData<SessionChanges>(queryKeys.customers.session()) ?? { created: [], updated: {}, deleted: [] },
          lists: queryClient.getQueriesData<CustomerPage>({ queryKey: queryKeys.customers.lists() }),
          details: queryClient.getQueriesData<Customer>({ queryKey: ["customers", "detail"] }),
        };
        const existing = queryClient.getQueryData<Customer>(queryKeys.customers.detail(id)) ?? snapshot.lists.flatMap(([, page]) => page?.users ?? []).find((item) => item.id === id);
        if (!existing) return snapshot;
        const updated: Customer = { ...existing, ...data, company: { ...existing.company, ...data.company, address: { ...existing.company.address, ...data.company?.address } }, address: { ...existing.address, ...data.address } };
        saveSessionChanges(queryClient, { ...snapshot.session, updated: { ...snapshot.session.updated, [id]: updated } });
        queryClient.setQueriesData<CustomerPage>({ queryKey: queryKeys.customers.lists() }, (page) => page ? applyCustomerUpdate(page, updated) : page);
        queryClient.setQueryData(queryKeys.customers.detail(id), updated);
        return snapshot;
      },
      onError: (_error, _variables, snapshot) => {
        if (!snapshot) return;
        saveSessionChanges(queryClient, snapshot.session);
        snapshot.lists.forEach(([key, value]) => queryClient.setQueryData(key, value));
        snapshot.details.forEach(([key, value]) => queryClient.setQueryData(key, value));
      },
      onSuccess: (response) => {
        const changes = queryClient.getQueryData<SessionChanges>(queryKeys.customers.session()) ?? { created: [], updated: {}, deleted: [] };
        const updated = { ...response, ...changes.updated[response.id] };
        saveSessionChanges(queryClient, { ...changes, updated: { ...changes.updated, [response.id]: updated } });
        queryClient.setQueriesData<CustomerPage>({ queryKey: queryKeys.customers.lists() }, (page) => page ? applyCustomerUpdate(page, updated) : page);
        queryClient.setQueryData(queryKeys.customers.detail(response.id), updated);
      },
      onSettled: async (_data, _error, variables) => {
        await queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
        await queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(variables.id) });
      },
    },
  });
  const generatedMutateAsync = mutation.mutateAsync;
  const mutateAsync = useCallback(({ id, input }: { id: number; input: CustomerInput }) => generatedMutateAsync({ id, data: input }), [generatedMutateAsync]);
  return { ...mutation, mutateAsync };
}
