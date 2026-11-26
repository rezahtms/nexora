import { CUSTOMER_PAGE_SIZE } from "@/lib/constants/config";
import type { CustomerListParams } from "@/lib/types/customer.types";
import type { SearchParamValues } from "@/lib/types/route.types";

export function parseCustomerListParams(values: SearchParamValues): CustomerListParams {
  const rawPage = Number(Array.isArray(values.page) ? values.page[0] : (values.page ?? "1"));
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const q = Array.isArray(values.q) ? (values.q[0] ?? "") : (values.q ?? "");
  const orderValue = Array.isArray(values.order) ? values.order[0] : values.order;
  const order = orderValue === "desc" ? "desc" : "asc";
  return {
    q,
    page,
    limit: CUSTOMER_PAGE_SIZE,
    sortBy: "firstName",
    order,
  };
}
