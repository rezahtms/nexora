import type { CustomerCacheChanges } from "@/lib/types/customer.types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://dummyjson.com";
export const API_TIMEOUT_MS = 15_000;
export const CUSTOMER_PAGE_SIZE = 10;
export const QUERY_STALE_TIME = 60_000;
export const QUERY_GC_TIME = 10 * 60_000;

export const EMPTY_CUSTOMER_CACHE_CHANGES: CustomerCacheChanges = {
  created: [],
  updated: {},
  deleted: [],
};
