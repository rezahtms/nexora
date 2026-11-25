"use client";

import { useCallback, useMemo } from "react";
import { Building2, Mail, Phone } from "lucide-react";
import CustomerActions from "@/components/pages/customers/customer-actions";
import CustomerAvatar from "@/components/pages/customers/customer-avatar";
import CustomerNameCell from "@/components/pages/customers/customer-name-cell";
import DataTable from "@/components/shared/data-table/data-table";
import DataTableEmpty from "@/components/shared/data-table/data-table-empty";
import ErrorState from "@/components/shared/error-state";
import Loader from "@/components/shared/loader";
import Pagination from "@/components/shared/pagination";
import SearchInput from "@/components/shared/search-input";
import useCustomers from "@/lib/hooks/use-customers";
import type { Customer } from "@/lib/types/customer.types";
import type { ColumnDef, SortState } from "@/lib/types/table.types";

const customerColumns: readonly ColumnDef<Customer>[] = [
  {
    id: "avatar",
    header: "Profile image",
    mobileRole: "leading",
    cell: (customer) => <CustomerAvatar customer={customer} size="sm" />,
  },
  {
    id: "firstName",
    header: "Full name",
    sortable: true,
    isRowHeader: true,
    mobileRole: "title",
    cell: (customer) => <CustomerNameCell customer={customer} />,
  },
  {
    id: "email",
    header: "Email",
    className: "text-muted-foreground",
    mobileRole: "detail",
    cell: (customer) => (
      <span className="flex min-w-0 items-center gap-2 md:inline">
        <Mail className="size-4 shrink-0 md:hidden" aria-hidden="true" />
        <span className="truncate">{customer.email}</span>
      </span>
    ),
  },
  {
    id: "phone",
    header: "Phone",
    className: "text-muted-foreground",
    mobileRole: "detail",
    cell: (customer) => (
      <span className="flex items-center gap-2 md:inline">
        <Phone className="size-4 shrink-0 md:hidden" aria-hidden="true" />
        <span>{customer.phone}</span>
      </span>
    ),
  },
  {
    id: "company",
    header: "Company",
    className: "text-muted-foreground",
    mobileRole: "detail",
    cell: (customer) => (
      <span className="flex min-w-0 items-center gap-2 md:inline">
        <Building2 className="size-4 shrink-0 md:hidden" aria-hidden="true" />
        <span className="truncate">{customer.company.name}</span>
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    headerClassName: "text-right",
    className: "px-3 py-2",
    mobileRole: "actions",
    cell: (customer) => <CustomerActions customer={customer} />,
  },
];

function getCustomerRowId(customer: Customer): number {
  return customer.id;
}

export default function CustomerList() {
  const {
    params,
    query,
    page,
    order,
    searchTerm,
    setSearchTerm,
    setPage,
    toggleSort,
    clearSearch,
    isDebouncing,
    isPending,
  } = useCustomers();

  const customers = query.data?.users ?? [];
  const pageCount = query.data ? Math.max(1, Math.ceil(query.data.total / params.limit)) : 1;
  const sort = useMemo<SortState>(() => ({ columnId: "firstName", order }), [order]);

  const handleSortChange = useCallback(
    (columnId: string) => {
      if (columnId === "firstName") toggleSort();
    },
    [toggleSort],
  );

  const isInitialLoading = query.isPending && !query.data;

  return (
    <section aria-label="Customer directory" className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          pending={isDebouncing || isPending || query.isFetching}
        />
        {query.data ? (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Showing <span className="font-medium text-foreground">{customers.length}</span> of{" "}
            <span className="font-medium text-foreground">{query.data.total}</span> customers
          </p>
        ) : null}
      </div>
      {query.isError && !query.data ? (
        <ErrorState onRetry={() => void query.refetch()} />
      ) : (
        <>
          {isInitialLoading ? <Loader /> : null}
          <DataTable
            caption="Customer directory with contact and company details"
            columns={customerColumns}
            data={customers}
            getRowId={getCustomerRowId}
            isLoading={isInitialLoading}
            sort={sort}
            onSortChange={handleSortChange}
            emptyState={
              <DataTableEmpty
                title={params.q ? `No customers match “${params.q}”` : "No customers yet"}
                description={
                  params.q
                    ? "Try another name, or clear your search to see everyone."
                    : "Add a customer to start building your directory."
                }
                actionLabel={params.q ? "Clear filters" : undefined}
                onAction={params.q ? clearSearch : undefined}
              />
            }
          />
        </>
      )}
      {query.data && customers.length > 0 ? (
        <Pagination page={page} pageCount={pageCount} total={query.data.total} onPageChange={setPage} />
      ) : null}
      {query.data && query.isFetching && !query.isPending ? (
        <p className="sr-only" role="status" aria-live="polite">
          Updating customer results
        </p>
      ) : null}
    </section>
  );
}
