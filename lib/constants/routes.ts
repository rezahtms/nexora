export const routes = {
  home: "/",
  customers: "/customers",
  customer: (id: number) => `/customers/${id}`,
} as const;
