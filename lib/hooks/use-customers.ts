"use client";

import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import useCustomerFilters from "@/lib/hooks/use-customer-filters";
import { customerListQueryOptions } from "@/lib/utils/query-options";
import { queryKeys } from "@/lib/constants/query-keys";
import type { CustomerPage, SessionChanges } from "@/lib/types/customer.types";
import { EMPTY_SESSION_CHANGES } from "@/lib/constants/config";
import { mergeCustomerPage } from "@/lib/utils/customer-session";

export default function useCustomers() {
  const filters = useCustomerFilters();
  const queryClient = useQueryClient();
  const session = useQuery<SessionChanges>({ queryKey: queryKeys.customers.session(), queryFn: async () => EMPTY_SESSION_CHANGES, staleTime: Infinity, initialData: () => queryClient.getQueryData<SessionChanges>(queryKeys.customers.session()) ?? EMPTY_SESSION_CHANGES });
  const select = useCallback((page: CustomerPage) => mergeCustomerPage(page, session.data, filters.params), [session.data, filters.params]);
  const query = useQuery({
    ...customerListQueryOptions(filters.params),
    placeholderData: keepPreviousData,
    select,
  });
  return { ...filters, query };
}
