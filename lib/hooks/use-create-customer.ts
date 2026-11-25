"use client";

import { useCallback } from "react";
import { useAddUser } from "@/lib/api/generated/users/users";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/query-keys";
import type { CustomerInput, SessionChanges } from "@/lib/types/customer.types";
import { saveSessionChanges } from "@/lib/utils/session-storage";

export default function useCreateCustomer() {
  const queryClient = useQueryClient();
  const mutation = useAddUser({
    mutation: {
      scope: { id: "customer-writes" },
      onSuccess: (response) => {
        const changes = queryClient.getQueryData<SessionChanges>(queryKeys.customers.session()) ?? { created: [], updated: {}, deleted: [] };
        const customer = { ...response, id: response.id + changes.created.length };
        saveSessionChanges(queryClient, { ...changes, created: [...changes.created, customer] });
        queryClient.setQueryData(queryKeys.customers.detail(customer.id), customer);
        void queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
      },
    },
  });
  const generatedMutateAsync = mutation.mutateAsync;
  const mutateAsync = useCallback((input: CustomerInput) => generatedMutateAsync({ data: input }), [generatedMutateAsync]);
  return { ...mutation, mutateAsync };
}
