export const CUSTOMER_PAGE_SIZE = 10;
export const QUERY_STALE_TIME = 60_000;
export const QUERY_GC_TIME = 10 * 60_000;
import type { SessionChanges } from "@/lib/types/customer.types";

export const EMPTY_SESSION_CHANGES: SessionChanges = { created: [], updated: {}, deleted: [] };
