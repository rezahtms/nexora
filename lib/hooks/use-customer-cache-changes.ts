"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EMPTY_CUSTOMER_CACHE_CHANGES } from "@/lib/constants/config";
import { customerKeys } from "@/lib/services/customer/customer.keys";
import type { CustomerCacheChanges } from "@/lib/types/customer.types";

export default function useCustomerCacheChanges() {
  const queryClient = useQueryClient();

  return useQuery<CustomerCacheChanges>({
    queryKey: customerKeys.cacheChanges(),
    queryFn: async () =>
      queryClient.getQueryData<CustomerCacheChanges>(customerKeys.cacheChanges()) ??
      EMPTY_CUSTOMER_CACHE_CHANGES,
    staleTime: Infinity,
    gcTime: Infinity,
    initialData: () =>
      queryClient.getQueryData<CustomerCacheChanges>(customerKeys.cacheChanges()) ??
      EMPTY_CUSTOMER_CACHE_CHANGES,
  });
}
