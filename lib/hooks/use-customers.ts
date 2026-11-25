"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import useCustomerCacheChanges from "@/lib/hooks/use-customer-cache-changes";
import useCustomerFilters from "@/lib/hooks/use-customer-filters";
import { customersQueryOptions } from "@/lib/services/customer/customer.options";
import type { CustomerPage } from "@/lib/types/customer.types";
import { mergeCustomerPage } from "@/lib/utils/customer-cache";

export default function useCustomers() {
  const filters = useCustomerFilters();
  const cacheChanges = useCustomerCacheChanges();

  const select = useCallback(
    (page: CustomerPage) => mergeCustomerPage(page, cacheChanges.data, filters.params),
    [cacheChanges.data, filters.params],
  );

  const query = useQuery({
    ...customersQueryOptions(filters.params),
    placeholderData: keepPreviousData,
    select,
  });

  return { ...filters, query };
}
