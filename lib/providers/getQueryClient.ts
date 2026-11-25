import { cache } from "react";
import { isServer, QueryClient } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/providers/queryClient";

const getServerQueryClient = cache(makeQueryClient);

let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (isServer) {
    return getServerQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
