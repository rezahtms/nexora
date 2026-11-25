"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/button";
import useCustomerFilters from "@/lib/hooks/use-customer-filters";

const CustomerForm = dynamic(() => import("@/components/pages/customers/customer-form"));

export default function AddCustomerButton() {
  const [open, setOpen] = useState(false);
  const { setPage } = useCustomerFilters();
  function completeAdd() {
    setPage(1);
    setOpen(false);
  }
  return (
    <>
      <Button className="min-h-12 w-full sm:w-auto" onClick={() => setOpen(true)}><Plus aria-hidden="true" /> Add customer</Button>
      {open ? <CustomerForm open={open} onOpenChange={setOpen} onComplete={completeAdd} /> : null}
    </>
  );
}
