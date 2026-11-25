"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EMPTY_SESSION_CHANGES } from "@/lib/constants/config";
import { queryKeys } from "@/lib/constants/query-keys";
import type { SessionChanges } from "@/lib/types/customer.types";
import { readSessionChanges } from "@/lib/utils/session-storage";

export default function useCustomerSession() {
  const queryClient = useQueryClient();
  const session = useQuery<SessionChanges>({
    queryKey: queryKeys.customers.session(),
    queryFn: async () => EMPTY_SESSION_CHANGES,
    staleTime: Infinity,
    initialData: () => queryClient.getQueryData<SessionChanges>(queryKeys.customers.session()) ?? EMPTY_SESSION_CHANGES,
  });

  useEffect(() => {
    queryClient.setQueryData(queryKeys.customers.session(), readSessionChanges());
  }, [queryClient]);

  return session;
}
