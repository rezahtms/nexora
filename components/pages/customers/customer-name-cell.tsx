"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { routes } from "@/lib/constants/routes";
import type { Customer } from "@/lib/types/customer.types";
import { serializeSearchParams } from "@/lib/utils/serialize-search-params";

export default function CustomerNameCell({ customer }: { customer: Customer }) {
  const searchParams = useSearchParams();
  const queryString = serializeSearchParams(searchParams);
  const href = `${routes.customer(customer.id)}${queryString ? `?${queryString}` : ""}`;

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
