import { QueryClient } from "@tanstack/react-query";
import { QUERY_GC_TIME, QUERY_STALE_TIME } from "@/lib/constants/config";

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME,
        gcTime: QUERY_GC_TIME,
        refetchOnMount: false,
        retry: 1,
      },
    },
  });
}
