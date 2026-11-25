import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import useCustomer from "@/lib/hooks/useCustomer";
import { customerKeys } from "@/lib/services/customer/customer.keys";
import type { Customer, CustomerCacheChanges } from "@/lib/types/customer.types";

const seededCustomer: Customer = {
  id: 209,
  firstName: "Seeded",
  lastName: "Customer",
  email: "seeded@example.com",
  phone: "555-0000",
  image: "https://dummyjson.com/icon/seeded/128",
  address: { address: "1 Test Street", city: "Amsterdam", country: "Netherlands" },
  company: { name: "Acme" },
};

function Probe({ id }: { id: number | null }) {
  const query = useCustomer(id);
  if (query.isNotFound) {
    return createElement("span", null, "not-found");
  }
  if (query.isLoading) {
    return createElement("span", null, "loading");
  }
  if (query.data) {
    return createElement("span", null, `${query.data.firstName} ${query.data.lastName}`);
  }
  return createElement("span", null, "empty");
}

function renderProbe(queryClient: QueryClient, id: number | null): string {
  return renderToStaticMarkup(
    createElement(QueryClientProvider, { client: queryClient }, createElement(Probe, { id })),
  );
}

describe("cache-seeded detail behavior", () => {
  it("renders a cache-seeded customer without loading or not-found", () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: 60_000 } },
    });
    const changes: CustomerCacheChanges = {
      created: [seededCustomer],
      updated: {},
      deleted: [],
    };
    queryClient.setQueryData(customerKeys.cacheChanges(), changes);
    queryClient.setQueryData(customerKeys.detail(seededCustomer.id), seededCustomer);

    const html = renderProbe(queryClient, seededCustomer.id);
    expect(html).toContain("Seeded Customer");
    expect(html).not.toContain("loading");
    expect(html).not.toContain("not-found");
  });

  it("renders not-found for a deleted cache-seeded customer", () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: 60_000 } },
    });
    queryClient.setQueryData<CustomerCacheChanges>(customerKeys.cacheChanges(), {
      created: [seededCustomer],
      updated: {},
      deleted: [seededCustomer.id],
    });

    const html = renderProbe(queryClient, seededCustomer.id);
    expect(html).toContain("not-found");
  });
});
