"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import useCustomerCacheChanges from "@/lib/hooks/useCustomerCacheChanges";
import { customerKeys } from "@/lib/services/customer/customer.keys";
import { customerDetailQueryOptions } from "@/lib/services/customer/customer.options";
import type { Customer } from "@/lib/types/customer.types";
import { isNotFoundError } from "@/lib/utils/isNotFoundError";

export default function useCustomer(id: number | null) {
  const queryClient = useQueryClient();
  const cacheChanges = useCustomerCacheChanges();

  const isValidId = id !== null;
  const isDeleted = isValidId && cacheChanges.data.deleted.includes(id);
  const seededCustomer = useMemo(() => {
    if (!isValidId) {
      return undefined;
    }
    const created = cacheChanges.data.created.find((customer) => customer.id === id);
    if (!created) {
      return undefined;
    }
    return cacheChanges.data.updated[id] ?? created;
  }, [cacheChanges.data.created, cacheChanges.data.updated, id, isValidId]);

  const cachedCustomer = useMemo(() => {
    if (!isValidId) {
      return undefined;
    }
    if (seededCustomer) {
      return seededCustomer;
    }
    return queryClient.getQueryData<Customer>(customerKeys.detail(id));
  }, [id, isValidId, queryClient, seededCustomer]);

  const select = useCallback(
    (customer: Customer) => {
      if (id === null) {
        return customer;
      }
      return cacheChanges.data.updated[id] ?? customer;
    },
    [cacheChanges.data.updated, id],
  );

  const baseOptions = customerDetailQueryOptions(id ?? 0);
  const hasSeededData = seededCustomer !== undefined;

  const query = useQuery({
    ...baseOptions,
    enabled: isValidId && !isDeleted && !hasSeededData,
    initialData: cachedCustomer,
    staleTime: hasSeededData ? Infinity : baseOptions.staleTime,
    gcTime: hasSeededData ? Infinity : undefined,
    refetchOnMount: hasSeededData ? false : undefined,
    refetchOnWindowFocus: false,
    refetchOnReconnect: hasSeededData ? false : undefined,
    retry: hasSeededData ? false : 1,
    select,
  });

  const isNotFound = !isValidId || isDeleted || (!hasSeededData && isNotFoundError(query.error));

  return {
    ...query,
    data: isDeleted ? undefined : query.data,
    isNotFound,
  };
}
