"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import useCustomerCacheChanges from "@/lib/hooks/use-customer-cache-changes";
import { customerKeys } from "@/lib/services/customer/customer.keys";
import { customerDetailQueryOptions } from "@/lib/services/customer/customer.options";
import type { Customer } from "@/lib/types/customer.types";
import { isNotFoundError } from "@/lib/utils/is-not-found-error";

export default function useCustomer(id: number | null) {
  const queryClient = useQueryClient();
  const cacheChanges = useCustomerCacheChanges();

  const isValidId = id !== null;
  const isDeleted = isValidId && cacheChanges.data.deleted.includes(id);
  const createdCustomer = isValidId
    ? cacheChanges.data.created.find((customer) => customer.id === id)
    : undefined;
  const cachedCustomer =
    isValidId && createdCustomer
      ? (cacheChanges.data.updated[id] ??
        queryClient.getQueryData<Customer>(customerKeys.detail(id)) ??
        createdCustomer)
      : undefined;

  const select = useCallback(
    (customer: Customer) => (id !== null ? (cacheChanges.data.updated[id] ?? customer) : customer),
    [cacheChanges.data.updated, id],
  );

  const baseOptions = customerDetailQueryOptions(id ?? 0);

  const query = useQuery({
    ...baseOptions,
    enabled: isValidId && !isDeleted && !cachedCustomer,
    initialData: cachedCustomer,
    staleTime: cachedCustomer ? Infinity : baseOptions.staleTime,
    select,
  });

  const isNotFound = !isValidId || isDeleted || isNotFoundError(query.error);

  return {
    ...query,
    data: isDeleted ? undefined : query.data,
    isNotFound,
  };
}
