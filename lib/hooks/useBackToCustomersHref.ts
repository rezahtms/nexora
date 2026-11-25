"use client";

import { routes } from "@/lib/constants/routes";
import useQueryParams, { buildQueryString } from "@/lib/hooks/useQueryParams";

type CustomerListQuery = {
  q?: string;
  page?: string;
  sortBy?: string;
  order?: string;
};

export default function useBackToCustomersHref(): string {
  const { query } = useQueryParams<CustomerListQuery>();
  const queryString = buildQueryString(query);
  return queryString ? `${routes.customers}?${queryString}` : routes.customers;
}
