"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";
import useQueryParams, { buildQueryString } from "@/lib/hooks/useQueryParams";
import type { Customer } from "@/lib/types/customer.types";

const DeleteCustomerModal = dynamic(
  () => import("@/components/pages/customers/modals/DeleteCustomerModal"),
);

type CustomerListQuery = {
  q?: string;
  page?: string;
  sortBy?: string;
  order?: string;
};

type CustomerActionsProps = {
  customer: Customer;
};

export default function CustomerActions({ customer }: CustomerActionsProps) {
  const { query } = useQueryParams<CustomerListQuery>();
  const queryString = buildQueryString(query);
  const viewHref = queryString
    ? `${routes.customer(customer.id)}?${queryString}`
    : routes.customer(customer.id);
  const fullName = `${customer.firstName} ${customer.lastName}`;

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="min-h-11 min-w-11"
        aria-label={`View ${fullName}`}
        nativeButton={false}
        render={<Link href={viewHref} />}
      >
        <Eye aria-hidden="true" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="min-h-11 min-w-11"
        aria-label={`Edit ${fullName}`}
        nativeButton={false}
        render={<Link href={routes.editCustomer(customer.id)} />}
      >
        <Pencil aria-hidden="true" />
      </Button>

      <DeleteCustomerModal
        customer={customer}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11 text-destructive hover:text-destructive"
            aria-label={`Delete ${fullName}`}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        }
      />
    </div>
  );
}
