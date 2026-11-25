type AppRoutes = {
  readonly home: "/";
  readonly customers: "/customers";
  readonly newCustomer: "/customers/new";
  readonly customer: (id: number) => `/customers/${number}`;
  readonly editCustomer: (id: number) => `/customers/${number}/edit`;
};

export const routes: AppRoutes = {
  home: "/",
  customers: "/customers",
  newCustomer: "/customers/new",
  customer: (id: number) => `/customers/${id}`,
  editCustomer: (id: number) => `/customers/${id}/edit`,
};
