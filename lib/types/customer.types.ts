export type Coordinates = {
  lat?: number;
  lng?: number;
};

export type Address = {
  address?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  postalCode?: string;
  coordinates?: Coordinates;
  country?: string;
};

export type Company = {
  department?: string;
  name?: string;
  title?: string;
  address?: Address;
};

export type Bank = {
  cardExpire?: string;
  cardNumber?: string;
  cardType?: string;
  currency?: string;
  iban?: string;
};

export type Hair = {
  color?: string;
  type?: string;
};

export type Crypto = {
  coin?: string;
  wallet?: string;
  network?: string;
};

export type CustomerInput = {
  firstName?: string;
  lastName?: string;
  maidenName?: string;
  age?: number;
  gender?: string;
  email?: string;
  phone?: string;
  username?: string;
  password?: string;
  birthDate?: string;
  image?: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  eyeColor?: string;
  hair?: Hair;
  address?: Address;
  macAddress?: string;
  university?: string;
  ip?: string;
  bank?: Bank;
  company?: Company;
  ein?: string;
  ssn?: string;
  userAgent?: string;
  crypto?: Crypto;
  role?: string;
};

export type Customer = CustomerInput & {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  address: Address;
  company: Company;
};

export type CustomerPage = {
  users: Customer[];
  total: number;
  skip: number;
  limit: number;
};

export type CustomerDeleteResponse = Customer & {
  isDeleted: boolean;
  deletedOn: string;
};

export type CustomerSortOrder = "asc" | "desc";

export type CustomerListParams = {
  q: string;
  page: number;
  limit: number;
  sortBy: "firstName";
  order: CustomerSortOrder;
};

export type CustomerApiListParams = {
  limit: number;
  skip: number;
  sortBy: "firstName";
  order: CustomerSortOrder;
};

export type CustomerApiSearchParams = CustomerApiListParams & {
  q: string;
};

export type CustomerUpdateRequest = {
  id: number;
  input: CustomerInput;
};

export type CustomerCacheChanges = {
  created: Customer[];
  updated: Record<number, Customer>;
  deleted: number[];
};

export type CustomerProfileSections = {
  personal: Pick<
    Customer,
    | "firstName"
    | "lastName"
    | "maidenName"
    | "age"
    | "gender"
    | "birthDate"
    | "bloodGroup"
    | "height"
    | "weight"
    | "eyeColor"
    | "hair"
  >;
  contact: Pick<Customer, "email" | "phone" | "username" | "university">;
  address: Address;
  company: Company;
  bank?: Bank;
  crypto?: Crypto;
};
