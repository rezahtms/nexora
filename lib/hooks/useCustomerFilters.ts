"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useQueryParams from "@/lib/hooks/useQueryParams";
import useDebounce from "@/lib/hooks/useDebounce";
import type { CustomerListParams, CustomerSortOrder } from "@/lib/types/customer.types";
import { parseCustomerListParams } from "@/lib/utils/parseCustomerListParams";

type SearchDraft = {
  value: string;
  sourceQuery: string;
};

type CustomerListQuery = {
  q?: string;
  page?: string;
  sortBy?: string;
  order?: string;
};

export default function useCustomerFilters() {
  const { query, setQueryParams, isPending } = useQueryParams<CustomerListQuery>();
  const params = useMemo<CustomerListParams>(() => parseCustomerListParams(query), [query]);
  const [draft, setDraft] = useState<SearchDraft | null>(null);
  const searchTerm = draft?.sourceQuery === params.q ? draft.value : params.q;
  const debouncedTerm = useDebounce(searchTerm, 350);
  const isDebouncing = searchTerm.trim() !== debouncedTerm.trim();

  useEffect(() => {
    if (draft?.sourceQuery !== params.q || debouncedTerm.trim() === params.q) {
      return;
    }
    setQueryParams({ q: debouncedTerm.trim(), page: "1" });
  }, [debouncedTerm, draft?.sourceQuery, params.q, setQueryParams]);

  const setSearchTerm = useCallback(
    (value: string) => {
      setDraft({ value, sourceQuery: params.q });
    },
    [params.q],
  );

  const clearSearch = useCallback(() => {
    setDraft({ value: "", sourceQuery: params.q });
    setQueryParams({ q: undefined, page: "1" });
  }, [params.q, setQueryParams]);

  const setPage = useCallback(
    (page: number) => {
      setQueryParams({ page: String(page) });
    },
    [setQueryParams],
  );

  const toggleSort = useCallback(() => {
    const nextOrder: CustomerSortOrder = params.order === "asc" ? "desc" : "asc";
    setQueryParams({ order: nextOrder, sortBy: "firstName", page: "1" });
  }, [params.order, setQueryParams]);

  return {
    params,
    searchTerm,
    setSearchTerm,
    setPage,
    toggleSort,
    clearSearch,
    isDebouncing,
    isPending,
  };
}
