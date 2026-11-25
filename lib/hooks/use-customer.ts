"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { EMPTY_SESSION_CHANGES } from "@/lib/constants/config";
import { queryKeys } from "@/lib/constants/query-keys";
import type { Customer, SessionChanges } from "@/lib/types/customer.types";
import { customerDetailQueryOptions } from "@/lib/utils/query-options";

export default function useCustomer(id: number) {
  const queryClient = useQueryClient();
  const session = useQuery<SessionChanges>({ queryKey: queryKeys.customers.session(), queryFn: async () => EMPTY_SESSION_CHANGES, staleTime: Infinity, initialData: () => queryClient.getQueryData<SessionChanges>(queryKeys.customers.session()) ?? EMPTY_SESSION_CHANGES });
  const select = useCallback((customer: Customer) => {
    if (session.data.deleted.includes(id)) throw new Error("CUSTOMER_NOT_FOUND");
    return session.data.updated[id] ?? customer;
  }, [session.data.deleted, session.data.updated, id]);
  return useQuery({ ...customerDetailQueryOptions(id, queryClient), select, enabled: typeof window !== "undefined" });
}
