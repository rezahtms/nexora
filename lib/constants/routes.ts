type AppRoutes = {
  readonly home: "/";
  readonly customers: "/customers";
  readonly newCustomer: "/customers/add";
  readonly customer: (id: number) => `/customers/${number}`;
  readonly editCustomer: (id: number) => `/customers/${number}/edit`;
};

export const routes: AppRoutes = {
  home: "/",
  customers: "/customers",
  newCustomer: "/customers/add",
  customer: (id: number) => `/customers/${id}`,
  editCustomer: (id: number) => `/customers/${id}/edit`,
};
