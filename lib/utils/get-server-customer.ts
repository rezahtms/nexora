import { cache } from "react";
import { getQueryClient } from "@/lib/providers/get-query-client";
import { customerDetailQueryOptions } from "@/lib/services/customer/customer.options";
import type { Customer } from "@/lib/types/customer.types";
import { isNotFoundError } from "@/lib/utils/is-not-found-error";

export const getServerCustomer = cache(async (id: number): Promise<Customer | null> => {
  const queryClient = getQueryClient();
  try {
    return await queryClient.fetchQuery(customerDetailQueryOptions(id));
  } catch (error: unknown) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
});
