import type { SearchParamValues } from "@/lib/types/route.types";

export function serializeSearchParams(values: SearchParamValues | URLSearchParams): string {
  if (values instanceof URLSearchParams) {
    return values.toString();
  }
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else if (value !== undefined) {
      params.set(key, value);
    }
  });
  return params.toString();
}
