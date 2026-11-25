"use client";

import { memo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Building2, Mail, Phone } from "lucide-react";
import CustomerActions from "@/components/pages/customers/customer-actions";
import CustomerAvatar from "@/components/pages/customers/customer-avatar";
import type { Customer } from "@/lib/types/customer.types";
import { routes } from "@/lib/constants/routes";

function CustomerCard({ customer }: { customer: Customer }) {
  const searchParams = useSearchParams();
  const href = `${routes.customer(customer.id)}${searchParams.size ? `?${searchParams.toString()}` : ""}`;
  return (
    <article className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <CustomerAvatar customer={customer} size="md" />
        <div className="min-w-0">
          <h2 className="truncate font-semibold"><Link href={href} className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{customer.firstName} {customer.lastName}</Link></h2>
          <p className="truncate text-sm text-muted-foreground">{customer.company.title || "Customer"}</p>
        </div>
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex min-w-0 items-center gap-2 text-muted-foreground"><Mail className="size-4 shrink-0" aria-hidden="true" /><dt className="sr-only">Email</dt><dd className="truncate">{customer.email}</dd></div>
        <div className="flex items-center gap-2 text-muted-foreground"><Phone className="size-4 shrink-0" aria-hidden="true" /><dt className="sr-only">Phone</dt><dd>{customer.phone}</dd></div>
        <div className="flex items-center gap-2 text-muted-foreground"><Building2 className="size-4 shrink-0" aria-hidden="true" /><dt className="sr-only">Company</dt><dd className="truncate">{customer.company.name}</dd></div>
      </dl>
      <div className="mt-3 border-t border-border/70 pt-2"><CustomerActions customer={customer} /></div>
    </article>
  );
}

export default memo(CustomerCard);
