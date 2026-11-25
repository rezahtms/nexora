import type { Customer, CustomerListParams, CustomerPage, SessionChanges } from "@/lib/types/customer.types";

export function mergeCustomerPage(page: CustomerPage, changes: SessionChanges, params: CustomerListParams): CustomerPage {
  const deletedIds = new Set(changes.deleted);
  const query = params.q.trim().toLocaleLowerCase();
  const baseCustomers = page.users
    .filter((customer) => !deletedIds.has(customer.id))
    .map((customer) => changes.updated[customer.id] ?? customer)
    .filter((customer) => matchesName(customer, query));
  const baseIds = new Set(baseCustomers.map((customer) => customer.id));
  const created = params.page === 1
    ? changes.created.filter((customer) => !deletedIds.has(customer.id) && !baseIds.has(customer.id)).filter((customer) => matchesName(customer, query))
    : [];
  const updatedNotOnPage = params.page === 1
    ? Object.values(changes.updated).filter((customer) => !deletedIds.has(customer.id) && !baseIds.has(customer.id)).filter((customer) => matchesName(customer, query))
    : [];
  const merged = [...baseCustomers, ...created, ...updatedNotOnPage].sort((left, right) => compareNames(left, right, params.order));
  const visible = merged.slice(0, params.limit);
  const createdIds = new Set(changes.created.map((customer) => customer.id));
  const matchingCreatedCount = changes.created.filter((customer) => !deletedIds.has(customer.id) && matchesName(customer, query)).length;
  const deletedCount = changes.deleted.filter((id) => {
    if (createdIds.has(id)) return false;
    const customer = changes.updated[id];
    return customer ? matchesName(customer, query) : false;
  }).length;
  const total = Math.max(0, page.total + matchingCreatedCount - deletedCount);
  return { ...page, users: visible, total, skip: (params.page - 1) * params.limit, limit: params.limit };
}

export function applyCustomerUpdate(page: CustomerPage, customer: Customer): CustomerPage {
  return {
    ...page,
    users: page.users.map((item) => item.id === customer.id ? customer : item),
  };
}

export function removeCustomer(page: CustomerPage, id: number): CustomerPage {
  const users = page.users.filter((customer) => customer.id !== id);
  return { ...page, users };
}

export function matchesName(customer: Customer, query: string): boolean {
  return `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(query);
}

function compareNames(left: Customer, right: Customer, order: CustomerListParams["order"]): number {
  const leftName = `${left.firstName} ${left.lastName}`.toLowerCase();
  const rightName = `${right.firstName} ${right.lastName}`.toLowerCase();
  const comparison = leftName < rightName ? -1 : leftName > rightName ? 1 : 0;
  return order === "asc" ? comparison : -comparison;
}
