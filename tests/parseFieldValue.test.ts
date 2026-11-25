import { describe, expect, it } from "vitest";
import { parseFieldValue } from "@/lib/utils/parseFieldValue";

describe("parseFieldValue", () => {
  it("returns string values for string fields", () => {
    expect(parseFieldValue("hello", "string")).toBe("hello");
    expect(parseFieldValue("", "string")).toBe("");
  });

  it("parses numeric values for number fields", () => {
    expect(parseFieldValue("42", "number")).toBe(42);
    expect(parseFieldValue("0", "number")).toBe(0);
  });

  it("returns 0 for empty number input", () => {
    expect(parseFieldValue("", "number")).toBe(0);
  });
});
