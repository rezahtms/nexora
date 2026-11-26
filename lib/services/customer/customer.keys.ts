import type { CustomerListParams } from "@/lib/types/customer.types";

export const customerKeys = {
  all: (): readonly ["customers"] => ["customers"],
  lists: (): readonly ["customers", "list"] => ["customers", "list"],
  list: (params: CustomerListParams): readonly ["customers", "list", CustomerListParams] => [
    "customers",
    "list",
    params,
  ],
  details: (): readonly ["customers", "detail"] => ["customers", "detail"],
  detail: (id: number): readonly ["customers", "detail", number] => ["customers", "detail", id],
  cacheChanges: (): readonly ["customers", "cache-changes"] => ["customers", "cache-changes"],
};
