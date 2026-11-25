"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import CardSkeleton from "@/components/shared/card-skeleton";
import CustomerCard from "@/components/pages/customers/customer-card";
import CustomerRow from "@/components/pages/customers/customer-row";
import EmptyState from "@/components/shared/empty-state";
import ErrorState from "@/components/shared/error-state";
import Loader from "@/components/shared/loader";
import Pagination from "@/components/shared/pagination";
import SearchInput from "@/components/shared/search-input";
import TableSkeleton from "@/components/shared/table-skeleton";
import Button from "@/components/ui/button";
import useCustomers from "@/lib/hooks/use-customers";

export default function CustomerList() {
  const { params, query, page, order, searchTerm, setSearchTerm, setPage, toggleSort, clearSearch, isDebouncing, isPending } = useCustomers();
  const customers = query.data?.users ?? [];
  const pageCount = query.data ? Math.max(1, Math.ceil(query.data.total / params.limit)) : 1;

  return (
    <section aria-label="Customer directory" className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput value={searchTerm} onChange={setSearchTerm} pending={isDebouncing || isPending || query.isFetching} />
          {query.data ? <p className="text-sm text-muted-foreground" aria-live="polite">Showing <span className="font-medium text-foreground">{customers.length}</span> of <span className="font-medium text-foreground">{query.data.total}</span> customers</p> : null}
        </div>
        {query.isError && !query.data ? <ErrorState onRetry={() => void query.refetch()} /> : null}
        {query.isPending && !query.data ? <><Loader /><div className="md:hidden"><CardSkeleton /></div><div className="hidden md:block"><TableSkeleton /></div></> : null}
        {query.data && customers.length === 0 ? (
          <EmptyState title={params.q ? `No customers match “${params.q}”` : "No customers yet"} description={params.q ? "Try another name, or clear your search to see everyone." : "Add a customer to start building your directory."} actionLabel={params.q ? "Clear filters" : undefined} onAction={params.q ? clearSearch : undefined} />
        ) : null}
        {customers.length > 0 ? (
          <>
            <div className="space-y-3 md:hidden" aria-label="Customer cards">
              {customers.map((customer) => <CustomerCard key={customer.id} customer={customer} />)}
            </div>
            <div className="hidden overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm md:block">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">Customer directory with contact and company details</caption>
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-4">Profile image</th>
                    <th scope="col" aria-sort={order === "asc" ? "ascending" : "descending"} className="px-5 py-4">
                      <Button className="h-auto min-h-11 p-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground" variant="ghost" onClick={toggleSort} aria-label={`Sort by name, currently ${order === "asc" ? "ascending" : "descending"}`}>
                        Full name {order === "asc" ? <ArrowUp aria-hidden="true" /> : <ArrowDown aria-hidden="true" />}
                      </Button>
                    </th>
                    <th scope="col" className="px-5 py-4">Email</th>
                    <th scope="col" className="px-5 py-4">Phone</th>
                    <th scope="col" className="px-5 py-4">Company</th>
                    <th scope="col" className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>{customers.map((customer) => <CustomerRow key={customer.id} customer={customer} />)}</tbody>
              </table>
            </div>
          </>
        ) : null}
        {query.data && customers.length > 0 ? <Pagination page={page} pageCount={pageCount} total={query.data.total} onPageChange={setPage} /> : null}
        {query.data && query.isFetching && !query.isPending ? <p className="sr-only" role="status" aria-live="polite">Updating customer results</p> : null}
    </section>
  );
}
