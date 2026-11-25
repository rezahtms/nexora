"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { CUSTOMER_PAGE_SIZE } from "@/lib/constants/config";
import useDebounce from "@/lib/hooks/use-debounce";
import type { CustomerListParams } from "@/lib/types/customer.types";

type SearchDraft = { value: string; sourceQuery: string };

export default function useCustomerFilters() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const rawPage = Number(searchParams.get("page") ?? "1");
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const order = searchParams.get("order") === "desc" ? "desc" : "asc";
  const [draft, setDraft] = useState<SearchDraft | null>(null);
  const searchTerm = draft?.sourceQuery === query ? draft.value : query;
  const debouncedTerm = useDebounce(searchTerm, 350);
  const [isPending, startTransition] = useTransition();
  const isDebouncing = searchTerm.trim() !== debouncedTerm.trim();

  const updateUrl = useCallback((values: { q?: string; page?: number; order?: "asc" | "desc" }) => {
    const next = new URLSearchParams(searchParams.toString());
    if (values.q !== undefined) {
      if (values.q) next.set("q", values.q);
      else next.delete("q");
      next.set("page", "1");
    }
    if (values.page !== undefined) next.set("page", String(values.page));
    if (values.order !== undefined) next.set("order", values.order);
    next.set("sortBy", "firstName");
    const queryString = next.toString();
    startTransition(() => window.history.replaceState(null, "", `${pathname}${queryString ? `?${queryString}` : ""}`));
  }, [pathname, searchParams]);

  useEffect(() => {
    if (draft?.sourceQuery !== query || debouncedTerm.trim() === query) return;
    updateUrl({ q: debouncedTerm.trim() });
  }, [debouncedTerm, draft?.sourceQuery, query, updateUrl]);

  const params = useMemo<CustomerListParams>(() => ({
    q: query,
    page,
    limit: CUSTOMER_PAGE_SIZE,
    sortBy: "firstName",
    order,
  }), [query, page, order]);

  const setSearchTerm = useCallback((value: string) => setDraft({ value, sourceQuery: query }), [query]);
  const setPage = useCallback((nextPage: number) => updateUrl({ page: nextPage }), [updateUrl]);
  const toggleSort = useCallback(() => updateUrl({ order: order === "asc" ? "desc" : "asc" }), [order, updateUrl]);
  const clearSearch = useCallback(() => {
    setDraft({ value: "", sourceQuery: query });
    updateUrl({ q: "" });
  }, [query, updateUrl]);

  return { params, query, page, order, searchTerm, setSearchTerm, setPage, toggleSort, clearSearch, isDebouncing, isPending };
}
