"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import useCustomerFilters from "@/lib/hooks/use-customer-filters";
import useCustomerSession from "@/lib/hooks/use-customer-session";
import { customerListQueryOptions } from "@/lib/utils/query-options";
import type { CustomerPage } from "@/lib/types/customer.types";
import { mergeCustomerPage } from "@/lib/utils/customer-session";

export default function useCustomers() {
  const filters = useCustomerFilters();
  const session = useCustomerSession();
  const select = useCallback((page: CustomerPage) => mergeCustomerPage(page, session.data, filters.params), [session.data, filters.params]);
  const query = useQuery({
    ...customerListQueryOptions(filters.params),
    placeholderData: keepPreviousData,
    select,
  });
  return { ...filters, query };
}
