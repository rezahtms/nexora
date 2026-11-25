import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/query-keys";
import type { Customer, SessionChanges } from "@/lib/types/customer.types";

const storageKey = "nexora-customer-changes";
const cookieKey = "nexora-customer-session";

export function readSessionChanges(): SessionChanges {
  if (typeof window === "undefined") return { created: [], updated: {}, deleted: [] };
  try {
    const serialized = window.sessionStorage.getItem(storageKey);
    if (!serialized) return { created: [], updated: {}, deleted: [] };
    const parsed: unknown = JSON.parse(serialized);
    return isSessionChanges(parsed) ? parsed : { created: [], updated: {}, deleted: [] };
  } catch {
    return { created: [], updated: {}, deleted: [] };
  }
}

export function saveSessionChanges(queryClient: QueryClient, changes: SessionChanges): void {
  queryClient.setQueryData(queryKeys.customers.session(), changes);
  if (typeof window === "undefined") return;
  const createdIds = changes.created.filter((customer) => !changes.deleted.includes(customer.id)).map((customer) => customer.id);
  const encodedIds = `c:${createdIds.join(",")}|d:${changes.deleted.join(",")}`;
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(changes));
    document.cookie = `${cookieKey}=${encodedIds}; path=/; SameSite=Lax`;
  } catch {
    return;
  }
}

function isSessionChanges(value: unknown): value is SessionChanges {
  if (typeof value !== "object" || value === null) return false;
  if (!("created" in value) || !("updated" in value) || !("deleted" in value)) return false;
  if (!Array.isArray(value.created) || !value.created.every(isCustomer)) return false;
  if (!Array.isArray(value.deleted) || !value.deleted.every((id) => typeof id === "number")) return false;
  if (typeof value.updated !== "object" || value.updated === null || Array.isArray(value.updated)) return false;
  return Object.values(value.updated).every(isCustomer);
}

function isCustomer(value: unknown): value is Customer {
  if (typeof value !== "object" || value === null) return false;
  if (!("id" in value) || !("firstName" in value) || !("lastName" in value) || !("email" in value) || !("phone" in value) || !("image" in value) || !("address" in value) || !("company" in value)) return false;
  return typeof value.id === "number"
    && typeof value.firstName === "string"
    && typeof value.lastName === "string"
    && typeof value.email === "string"
    && typeof value.phone === "string"
    && typeof value.image === "string"
    && typeof value.address === "object"
    && value.address !== null
    && typeof value.company === "object"
    && value.company !== null;
}
