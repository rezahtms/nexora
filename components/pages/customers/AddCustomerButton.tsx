"use client";

import dynamic from "next/dynamic";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import useQueryParams from "@/lib/hooks/useQueryParams";

const CustomerFormModal = dynamic(
  () => import("@/components/pages/customers/modals/CustomerFormModal"),
);

type CustomerListQuery = {
  q?: string;
  page?: string;
  sortBy?: string;
  order?: string;
};

export default function AddCustomerButton() {
  const { setQueryParams } = useQueryParams<CustomerListQuery>();

  return (
    <CustomerFormModal
      trigger={
        <Button className="min-h-11 w-full sm:w-auto">
          <Plus aria-hidden="true" data-icon="inline-start" />
          Add customer
        </Button>
      }
      onSuccess={() => setQueryParams({ page: "1" })}
    />
  );
}
