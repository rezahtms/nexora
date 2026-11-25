import { describe, expect, it } from "vitest";
import {
  buildQueryString,
  cleanQueryParamValue,
  mergeQueryParams,
  parseSearchParams,
} from "@/lib/hooks/useQueryParams";

describe("cleanQueryParamValue", () => {
  it("removes undefined, empty string, همه and empty arrays", () => {
    expect(cleanQueryParamValue(undefined)).toBeUndefined();
    expect(cleanQueryParamValue("")).toBeUndefined();
    expect(cleanQueryParamValue("همه")).toBeUndefined();
    expect(cleanQueryParamValue([])).toBeUndefined();
    expect(cleanQueryParamValue(["همه", ""])).toBeUndefined();
  });

  it("keeps valid values and filters removed entries from arrays", () => {
    expect(cleanQueryParamValue("john")).toBe("john");
    expect(cleanQueryParamValue(["a", "", "همه", "b"])).toEqual(["a", "b"]);
  });
});

describe("mergeQueryParams", () => {
  it("merges updates and removes cleaned values", () => {
    const result = mergeQueryParams(
      { q: "john", page: "2", order: "asc" },
      { q: "", page: "1", order: "desc" },
    );
    expect(result).toEqual({ page: "1", order: "desc" });
  });

  it("keeps existing values when no update is provided", () => {
    const result = mergeQueryParams({ q: "john", page: "2" }, { page: "3" });
    expect(result).toEqual({ q: "john", page: "3" });
  });
});

describe("buildQueryString and parseSearchParams", () => {
  it("builds and parses query strings consistently", () => {
    const queryString = buildQueryString({ q: "john doe", page: "2", tag: ["a", "b"] });
    const params = new URLSearchParams(queryString);
    expect(parseSearchParams(params)).toEqual({ q: "john doe", page: "2", tag: ["a", "b"] });
  });
});
