"use client";

import Link from "next/link";
import { routes } from "@/lib/constants/routes";
import useQueryParams, { buildQueryString } from "@/lib/hooks/useQueryParams";
import type { Customer } from "@/lib/types/customer.types";

type CustomerListQuery = {
  q?: string;
  page?: string;
  sortBy?: string;
  order?: string;
};

export default function CustomerNameCell({ customer }: { customer: Customer }) {
  const { query } = useQueryParams<CustomerListQuery>();
  const queryString = buildQueryString(query);
  const href = queryString
    ? `${routes.customer(customer.id)}?${queryString}`
    : routes.customer(customer.id);

  return (
    <div className="min-w-0">
      <Link
        className="block truncate rounded-md font-semibold hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:inline md:font-medium"
        href={href}
      >
        {customer.firstName} {customer.lastName}
      </Link>
      <p className="truncate text-sm text-muted-foreground md:hidden">
        {customer.company.title || "Customer"}
      </p>
    </div>
  );
}
