"use client";

import { useCallback, useState, type ReactElement } from "react";
import { usePathname, useRouter } from "next/navigation";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { routes } from "@/lib/constants/routes";
import useDeleteCustomer from "@/lib/services/customer/customerDelete.controller";
import type { Customer } from "@/lib/types/customer.types";

type DeleteCustomerModalProps = {
  trigger: ReactElement;
  customer: Customer;
};

export default function DeleteCustomerModal({ trigger, customer }: DeleteCustomerModalProps) {
  const [open, setOpen] = useState(false);
  const deleteCustomer = useDeleteCustomer();
  const router = useRouter();
  const pathname = usePathname();

  const handleConfirm = useCallback(async () => {
    await deleteCustomer.mutateAsync(customer.id);
    setOpen(false);
    if (pathname !== routes.customers) {
      router.replace(routes.customers);
    }
  }, [customer.id, deleteCustomer, pathname, router]);

  return (
    <ConfirmModal
      trigger={trigger}
      title={`Delete ${customer.firstName} ${customer.lastName}?`}
      description="This customer will be removed from your active customer list for this browser session."
      confirmLabel="Delete customer"
      isPending={deleteCustomer.isPending}
      onConfirm={() => void handleConfirm()}
      open={open}
      onOpenChange={setOpen}
    />
  );
}
