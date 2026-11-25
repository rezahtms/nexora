"use client";

import { useSearchParams } from "next/navigation";
import { routes } from "@/lib/constants/routes";
import { serializeSearchParams } from "@/lib/utils/serialize-search-params";

export default function useBackToCustomersHref(): string {
  const searchParams = useSearchParams();
  const queryString = serializeSearchParams(searchParams);
  return `${routes.customers}${queryString ? `?${queryString}` : ""}`;
}
