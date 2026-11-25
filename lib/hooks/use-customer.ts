"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import useCustomerSession from "@/lib/hooks/use-customer-session";
import type { Customer } from "@/lib/types/customer.types";
import { customerDetailQueryOptions } from "@/lib/utils/query-options";

export default function useCustomer(id: number) {
  const queryClient = useQueryClient();
  const session = useCustomerSession();
  const select = useCallback((customer: Customer) => {
    if (session.data.deleted.includes(id)) throw new Error("CUSTOMER_NOT_FOUND");
    return session.data.updated[id] ?? customer;
  }, [session.data.deleted, session.data.updated, id]);
  return useQuery({ ...customerDetailQueryOptions(id, queryClient), select, enabled: typeof window !== "undefined" });
}
