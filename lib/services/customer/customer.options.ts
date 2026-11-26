import { queryOptions } from "@tanstack/react-query";
import { QUERY_STALE_TIME } from "@/lib/constants/config";
import { getCustomerDetail } from "@/lib/services/customer/customerDetail.controller";
import { getCustomerList } from "@/lib/services/customer/customerList.controller";
import { customerKeys } from "@/lib/services/customer/customer.keys";
import type { CustomerListParams } from "@/lib/types/customer.types";

export function customersQueryOptions(params: CustomerListParams) {
  return queryOptions({
    queryKey: customerKeys.list(params),
    queryFn: ({ signal }) => getCustomerList(params, signal),
    staleTime: QUERY_STALE_TIME,
  });
}

export function customerDetailQueryOptions(id: number) {
  return queryOptions({
    queryKey: customerKeys.detail(id),
    queryFn: ({ signal }) => getCustomerDetail(id, signal),
    staleTime: QUERY_STALE_TIME,
  });
}
