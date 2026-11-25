"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { EMPTY_SESSION_CHANGES } from "@/lib/constants/config";
import { queryKeys } from "@/lib/constants/query-keys";
import { makeQueryClient } from "@/lib/providers/query-client";
import { readSessionChanges } from "@/lib/utils/session-storage";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => {
    const client = makeQueryClient();
    client.setQueryData(queryKeys.customers.session(), EMPTY_SESSION_CHANGES);
    return client;
  });

  useEffect(() => {
    queryClient.setQueryData(queryKeys.customers.session(), readSessionChanges());
  }, [queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
