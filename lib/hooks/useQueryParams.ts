"use client";

import { useCallback, useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type QueryParamValue = string | string[] | undefined;
type QueryParamInput = string | string[] | null | undefined;
type QueryParamsRecord = Record<string, QueryParamValue>;
type QueryUpdates = Record<string, QueryParamInput>;

const REMOVED_VALUES = new Set(["", "همه"]);

export function cleanQueryParamValue(value: QueryParamInput): QueryParamValue {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    const filtered = value.filter((item) => !REMOVED_VALUES.has(item));
    return filtered.length > 0 ? filtered : undefined;
  }
  return REMOVED_VALUES.has(value) ? undefined : value;
}

export function mergeQueryParams(
  current: QueryParamsRecord,
  updates: QueryUpdates,
): Record<string, string | string[]> {
  const merged: Record<string, string | string[]> = {};
  const keys = new Set<string>([...Object.keys(current), ...Object.keys(updates)]);

  keys.forEach((key) => {
    const hasUpdate = Object.prototype.hasOwnProperty.call(updates, key);
    const nextValue = hasUpdate ? updates[key] : current[key];
    const cleaned = cleanQueryParamValue(nextValue);
    if (cleaned !== undefined) {
      merged[key] = cleaned;
    }
  });

  return merged;
}

export function buildQueryString(
  params: Record<string, QueryParamValue | string | string[]>,
): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => search.append(key, item));
      return;
    }
    if (typeof value === "string") {
      search.set(key, value);
    }
  });
  return search.toString();
}

export function parseSearchParams(
  searchParams: URLSearchParams,
): QueryParamsRecord {
  const result: QueryParamsRecord = {};
  searchParams.forEach((_, key) => {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      return;
    }
    const values = searchParams.getAll(key);
    result[key] = values.length > 1 ? values : values[0];
  });
  return result;
}

export default function useQueryParams<TQuery extends QueryParamsRecord = QueryParamsRecord>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const query = useMemo(() => parseSearchParams(searchParams), [searchParams]);

  const setQueryParams = useCallback(
    (updates: Partial<Record<keyof TQuery, QueryParamInput>>) => {
      const nextUpdates: QueryUpdates = {};
      Object.entries(updates).forEach(([key, value]) => {
        nextUpdates[key] = value;
      });
      const merged = mergeQueryParams(query, nextUpdates);
      const queryString = buildQueryString(merged);
      startTransition(() => {
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
      });
    },
    [pathname, query, router, startTransition],
  );

  const removeQueryParam = useCallback(
    (key: keyof TQuery) => {
      const updates: Partial<Record<keyof TQuery, QueryParamInput>> = {};
      updates[key] = undefined;
      setQueryParams(updates);
    },
    [setQueryParams],
  );

  const clearQueryParams = useCallback(() => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [pathname, router, startTransition]);

  return useMemo(
    () => ({
      query,
      setQueryParams,
      removeQueryParam,
      clearQueryParams,
      isPending,
    }),
    [clearQueryParams, isPending, query, removeQueryParam, setQueryParams],
  );
}
