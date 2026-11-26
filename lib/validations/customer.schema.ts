import { z } from "zod";

export const customerSchema = z.object({
  firstName: z.string().trim().min(1, "Enter a first name.").max(60, "Use 60 characters or fewer."),
  lastName: z.string().trim().min(1, "Enter a last name.").max(60, "Use 60 characters or fewer."),
  email: z.email("Enter a valid email address."),
  phone: z.string().trim().min(5, "Enter a valid phone number.").max(30, "Use 30 characters or fewer."),
  company: z.object({
    name: z.string().trim().min(1, "Enter a company name.").max(100, "Use 100 characters or fewer."),
    title: z.string().trim().optional().default(""),
    department: z.string().trim().optional().default(""),
    address: z.object({
      address: z.string().optional().default(""),
      city: z.string().optional().default(""),
      state: z.string().optional().default(""),
      stateCode: z.string().optional().default(""),
      postalCode: z.string().optional().default(""),
      country: z.string().optional().default(""),
    }).optional(),
  }),
  age: z.coerce.number().int().min(0, "Age must be zero or older.").max(120, "Enter a valid age."),
  gender: z.string().trim().optional().default(""),
  maidenName: z.string().trim().optional().default(""),
  birthDate: z.string().trim().optional().default(""),
  image: z.url("Enter a valid profile image URL.").optional().or(z.literal("")),
  address: z.object({
    address: z.string().trim().optional().default(""),
    city: z.string().trim().optional().default(""),
    state: z.string().trim().optional().default(""),
    stateCode: z.string().trim().optional().default(""),
    postalCode: z.string().trim().optional().default(""),
    country: z.string().trim().optional().default(""),
  }).default({ address: "", city: "", state: "", stateCode: "", postalCode: "", country: "" }),
});

export type CustomerFormValues = z.input<typeof customerSchema>;
export type ValidCustomerFormValues = z.output<typeof customerSchema>;
