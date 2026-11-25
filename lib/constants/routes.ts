type AppRoutes = {
  readonly home: "/";
  readonly customers: "/customers";
  readonly customer: (id: number) => `/customers/${number}`;
};

export const routes: AppRoutes = {
  home: "/",
  customers: "/customers",
  customer: (id: number) => `/customers/${id}`,
};
