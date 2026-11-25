"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import Button from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";
import useBackToCustomersHref from "@/lib/hooks/use-back-to-customers-href";
import useDeleteCustomer from "@/lib/hooks/use-delete-customer";
import type { Customer } from "@/lib/types/customer.types";
import { serializeSearchParams } from "@/lib/utils/serialize-search-params";

const CustomerForm = dynamic(() => import("@/components/pages/customers/customer-form"));

export default function CustomerActions({ customer }: { customer: Customer }) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const deleteCustomer = useDeleteCustomer();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const backUrl = useBackToCustomersHref();
  const queryString = serializeSearchParams(searchParams);
  const viewHref = `${routes.customer(customer.id)}${queryString ? `?${queryString}` : ""}`;

  async function confirmDelete() {
    try {
      await deleteCustomer.mutateAsync(customer.id);
      setConfirmingDelete(false);
      if (pathname !== routes.customers) router.replace(backUrl);
    } catch {
      setConfirmingDelete(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Button
          className="min-h-11 min-w-11"
          variant="ghost"
          size="icon"
          aria-label={`View ${customer.firstName} ${customer.lastName}`}
          nativeButton={false}
          render={<Link href={viewHref} />}
        >
          <Eye aria-hidden="true" />
        </Button>
        <Button
          className="min-h-11 min-w-11"
          variant="ghost"
          size="icon"
          aria-label={`Edit ${customer.firstName} ${customer.lastName}`}
          onClick={() => setEditing(true)}
        >
          <Pencil aria-hidden="true" />
        </Button>
        <Button
          className="min-h-11 min-w-11 text-destructive hover:text-destructive"
          variant="ghost"
          size="icon"
          aria-label={`Delete ${customer.firstName} ${customer.lastName}`}
          onClick={() => setConfirmingDelete(true)}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </div>
      {editing ? (
        <CustomerForm
          open={editing}
          customer={customer}
          onOpenChange={setEditing}
          onComplete={() => setEditing(false)}
        />
      ) : null}
      <ConfirmDialog
        open={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        title={`Delete ${customer.firstName} ${customer.lastName}?`}
        description="This customer will be removed from your active customer list for this browser session."
        confirmLabel="Delete customer"
        pending={deleteCustomer.isPending}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}
