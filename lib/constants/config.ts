import type { CustomerCacheChanges } from "@/lib/types/customer.types";

const DEFAULT_API_BASE_URL = "https://dummyjson.com";
const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export const API_BASE_URL = configuredBaseUrl || DEFAULT_API_BASE_URL;
export const API_TIMEOUT_MS = 30_000;
export const CUSTOMER_PAGE_SIZE = 10;
export const QUERY_STALE_TIME = 60_000;
export const QUERY_GC_TIME = 10 * 60_000;

export const EMPTY_CUSTOMER_CACHE_CHANGES: CustomerCacheChanges = {
  created: [],
  updated: {},
  deleted: [],
};
