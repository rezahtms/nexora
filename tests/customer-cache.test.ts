import { describe, expect, it } from "vitest";
import type { Customer, CustomerListParams, CustomerPage } from "@/lib/types/customer.types";
import { applyCustomerUpdate, mergeCustomerPage, removeCustomerFromPage } from "@/lib/utils/customer-cache";
import { parseCustomerId } from "@/lib/utils/parse-customer-id";
import { parseCustomerListParams } from "@/lib/utils/parse-customer-list-params";
import { serializeSearchParams } from "@/lib/utils/serialize-search-params";

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

const created: Customer = {
  ...original,
  id: 2,
  firstName: "Avery",
  lastName: "Smith",
  email: "avery@example.com",
};

const page: CustomerPage = { users: [original], total: 1, skip: 0, limit: 10 };
const params: CustomerListParams = { q: "", page: 1, limit: 10, sortBy: "firstName", order: "asc" };

describe("customer cache helpers", () => {
  it("adds cache-created users and applies edits to listed records", () => {
    const updated = { ...original, firstName: "Zoe" };
    const result = mergeCustomerPage(
      page,
      { created: [created], updated: { [updated.id]: updated }, deleted: [] },
      params,
    );
    expect(result.users.map((customer) => customer.firstName)).toEqual(["Avery", "Zoe"]);
    expect(result.total).toBe(2);
  });

  it("hides deleted records and filters new records by full name", () => {
    const result = mergeCustomerPage(
      { ...page, users: [], total: 0 },
      { created: [created], updated: {}, deleted: [1] },
      { ...params, q: "avery" },
    );
    expect(result.users.map((customer) => customer.id)).toEqual([2]);
    expect(result.total).toBe(1);
  });

  it("applies direct updates and removals to cached pages", () => {
    const updated = applyCustomerUpdate(page, { ...original, firstName: "Morgan" });
    expect(updated.users[0]?.firstName).toBe("Morgan");
    const removed = removeCustomerFromPage(updated, original.id);
    expect(removed.users).toEqual([]);
  });
});

describe("route parameter helpers", () => {
  it("parses valid positive integer customer ids and rejects invalid input", () => {
    expect(parseCustomerId("42")).toBe(42);
    expect(parseCustomerId(["7", "8"])).toBe(7);
    expect(parseCustomerId("0")).toBeNull();
    expect(parseCustomerId("-5")).toBeNull();
    expect(parseCustomerId("12abc")).toBeNull();
    expect(parseCustomerId(undefined)).toBeNull();
  });

  it("parses customer list params with safe defaults", () => {
    expect(parseCustomerListParams({ q: "emily", page: "2", order: "desc" })).toEqual({
      q: "emily",
      page: 2,
      limit: 10,
      sortBy: "firstName",
      order: "desc",
    });
    expect(parseCustomerListParams({ page: "-1", order: "invalid" })).toEqual({
      q: "",
      page: 1,
      limit: 10,
      sortBy: "firstName",
      order: "asc",
    });
  });

  it("serializes search param records and URLSearchParams", () => {
    expect(serializeSearchParams({ q: "ava", page: "2" })).toBe("q=ava&page=2");
    expect(serializeSearchParams(new URLSearchParams("order=desc&page=3"))).toBe("order=desc&page=3");
  });
});
