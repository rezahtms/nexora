import type { CustomerListParams } from "@/lib/types/customer.types";

export const queryKeys = {
  customers: {
    all: ["customers"] as const,
    lists: () => ["customers", "list"] as const,
    list: (params: CustomerListParams) => ["customers", "list", params] as const,
    detail: (id: number) => ["customers", "detail", id] as const,
    session: () => ["customers", "session"] as const,
  },
};
