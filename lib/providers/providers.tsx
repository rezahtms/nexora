"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { makeQueryClient } from "@/lib/providers/query-client";
import { queryKeys } from "@/lib/constants/query-keys";
import { readSessionChanges } from "@/lib/utils/session-storage";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => {
    const client = makeQueryClient();
    client.setQueryData(queryKeys.customers.session(), readSessionChanges());
    return client;
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
