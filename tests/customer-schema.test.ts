import { describe, expect, it } from "vitest";
import { customerSchema } from "@/lib/validations/customer.schema";

const validCustomer = {
  firstName: "Avery",
  lastName: "Jordan",
  email: "avery@example.com",
  phone: "+31 20 555 0100",
  company: { name: "Northwind" },
  age: 34,
};

describe("customerSchema", () => {
  it("accepts a valid customer and coerces age to a number", () => {
    const result = customerSchema.parse({ ...validCustomer, age: "34" });
    expect(result.age).toBe(34);
    expect(result.company.name).toBe("Northwind");
  });

  it("reports useful errors for invalid required fields", () => {
    const result = customerSchema.safeParse({ ...validCustomer, email: "not-an-email", firstName: " " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toContain("email");
      expect(result.error.issues.map((issue) => issue.path[0])).toContain("firstName");
    }
  });
});
