"use client";

import { memo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CustomerActions from "@/components/pages/customers/customer-actions";
import CustomerAvatar from "@/components/pages/customers/customer-avatar";
import type { Customer } from "@/lib/types/customer.types";
import { routes } from "@/lib/constants/routes";

function CustomerRow({ customer }: { customer: Customer }) {
  const searchParams = useSearchParams();
  const href = `${routes.customer(customer.id)}${searchParams.size ? `?${searchParams.toString()}` : ""}`;
  return (
    <tr className="border-b border-border/70 last:border-0 hover:bg-muted/30">
      <td className="px-5 py-4"><CustomerAvatar customer={customer} size="sm" /></td>
      <th scope="row" className="px-5 py-4 text-left font-medium"><Link className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={href}>{customer.firstName} {customer.lastName}</Link></th>
      <td className="px-5 py-4 text-muted-foreground">{customer.email}</td>
      <td className="px-5 py-4 text-muted-foreground">{customer.phone}</td>
      <td className="px-5 py-4 text-muted-foreground">{customer.company.name}</td>
      <td className="px-3 py-2"><CustomerActions customer={customer} /></td>
    </tr>
  );
}

export default memo(CustomerRow);
