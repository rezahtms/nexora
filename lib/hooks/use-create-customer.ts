"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EMPTY_CUSTOMER_CACHE_CHANGES } from "@/lib/constants/config";
import { createCustomer } from "@/lib/services/customer/customer-create.controller";
import { customerKeys } from "@/lib/services/customer/customer.keys";
import type { Customer, CustomerCacheChanges, CustomerInput } from "@/lib/types/customer.types";

export default function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    scope: { id: "customer-writes" },
    mutationFn: (input: CustomerInput) => createCustomer(input),
    onSuccess: (response, variables) => {
      const current =
        queryClient.getQueryData<CustomerCacheChanges>(customerKeys.cacheChanges()) ??
        EMPTY_CUSTOMER_CACHE_CHANGES;
      const usedIds = new Set(current.created.map((item) => item.id));
      let nextId = response.id;
      while (usedIds.has(nextId)) {
        nextId += 1;
      }
      const customer: Customer = {
        ...variables,
        ...response,
        id: nextId,
        firstName: response.firstName ?? variables.firstName ?? "",
        lastName: response.lastName ?? variables.lastName ?? "",
        email: response.email ?? variables.email ?? "",
        phone: response.phone ?? variables.phone ?? "",
        image: response.image ?? variables.image ?? "",
        address: { ...variables.address, ...response.address },
        company: {
          ...variables.company,
          ...response.company,
          address: { ...variables.company?.address, ...response.company?.address },
        },
      };

      const nextChanges: CustomerCacheChanges = {
        ...current,
        created: [customer, ...current.created],
      };

      queryClient.setQueryData(customerKeys.cacheChanges(), nextChanges);
      queryClient.setQueryData(customerKeys.detail(customer.id), customer);
    },
  });
}
