import type { SearchParamValue } from "@/lib/types/route.types";

export function parseCustomerId(value: SearchParamValue): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !/^\d+$/.test(raw)) return null;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}
