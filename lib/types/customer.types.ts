import type { Address, Bank, Company, Crypto, Hair, User, UserInput, UserList } from "@/lib/api/generated/model";

export type Customer = User;
export type CustomerInput = UserInput;
export type CustomerPage = UserList;
export type CustomerSortOrder = "asc" | "desc";

export type CustomerListParams = {
  q: string;
  page: number;
  limit: number;
  sortBy: "firstName";
  order: CustomerSortOrder;
};

export type SessionChanges = {
  created: Customer[];
  updated: Record<number, Customer>;
  deleted: number[];
};

export type CustomerProfileSections = {
  personal: Pick<Customer, "firstName" | "lastName" | "maidenName" | "age" | "gender" | "birthDate" | "bloodGroup" | "height" | "weight" | "eyeColor" | "hair">;
  contact: Pick<Customer, "email" | "phone" | "username" | "university">;
  address: Address;
  company: Company;
  bank?: Bank;
  crypto?: Crypto;
};

export type { Address, Bank, Company, Crypto, Hair };
