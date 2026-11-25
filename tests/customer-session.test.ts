import { describe, expect, it } from "vitest";
import type { Customer, CustomerListParams, CustomerPage } from "@/lib/types/customer.types";
import { mergeCustomerPage } from "@/lib/utils/customer-session";

const original: Customer = {
  id: 1,
  firstName: "Jordan",
  lastName: "Lee",
  email: "jordan@example.com",
  phone: "555-0100",
  image: "https://dummyjson.com/icon/jordan/128",
  address: { address: "1 Main Street", city: "Amsterdam", country: "Netherlands" },
  company: { name: "Northwind" },
};

const created: Customer = { ...original, id: 2, firstName: "Avery", lastName: "Smith", email: "avery@example.com" };
const page: CustomerPage = { users: [original], total: 1, skip: 0, limit: 10 };
const params: CustomerListParams = { q: "", page: 1, limit: 10, sortBy: "firstName", order: "asc" };

describe("mergeCustomerPage", () => {
  it("adds session-created users and applies edits to listed records", () => {
    const updated = { ...original, firstName: "Zoe" };
    const result = mergeCustomerPage(page, { created: [created], updated: { [updated.id]: updated }, deleted: [] }, params);
    expect(result.users.map((customer) => customer.firstName)).toEqual(["Avery", "Zoe"]);
    expect(result.total).toBe(2);
  });

  it("hides session-deleted records and filters new records by full name", () => {
    const result = mergeCustomerPage({ ...page, users: [], total: 0 }, { created: [created], updated: {}, deleted: [1] }, { ...params, q: "avery" });
    expect(result.users.map((customer) => customer.id)).toEqual([2]);
    expect(result.total).toBe(1);
  });

  it("removes deleted customers from visible rows and totals", () => {
    const result = mergeCustomerPage(page, { created: [], updated: { [original.id]: original }, deleted: [original.id] }, params);
    expect(result.users).toEqual([]);
    expect(result.total).toBe(0);
  });
});
