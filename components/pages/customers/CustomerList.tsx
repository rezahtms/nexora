"use client";

import { useMemo } from "react";
import { AlertCircle, RefreshCw, Users } from "lucide-react";
import CustomerActions from "@/components/pages/customers/CustomerActions";
import CustomerAvatar from "@/components/pages/customers/CustomerAvatar";
import CustomerNameCell from "@/components/pages/customers/CustomerNameCell";
import DataTable from "@/components/shared/DataTable";
import SearchInput from "@/components/shared/SearchInput";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import useCustomers from "@/lib/services/customer/customerList.controller";
import type { Customer } from "@/lib/types/customer.types";
import type { ColumnDef } from "@/lib/types/table.types";

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
    cell: (customer) => <span className="truncate">{customer.email}</span>,
  },
  {
    id: "phone",
    header: "Phone",
    className: "text-muted-foreground",
    mobileRole: "detail",
    cell: (customer) => <span>{customer.phone}</span>,
  },
  {
    id: "company",
    header: "Company",
    className: "text-muted-foreground",
    mobileRole: "detail",
    cell: (customer) => <span className="truncate">{customer.company.name}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    headerClassName: "text-right",
    className: "text-right",
    mobileRole: "actions",
    cell: (customer) => <CustomerActions customer={customer} />,
  },
];

function getCustomerRowId(customer: Customer): number {
  return customer.id;
}

export default function CustomerList() {
  const { params, searchTerm, setSearchTerm, clearSearch, isDebouncing, isPending, query } = useCustomers();

  const tableData = useMemo(() => {
    if (!query.data) {
      return undefined;
    }
    return { items: query.data.users, total: query.data.total };
  }, [query.data]);

  const isInitialLoading = query.isPending && !query.data;

  return (
    <section aria-label="Customer directory" className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          pending={isDebouncing || isPending || query.isFetching}
        />
      </div>

      {query.isError && !query.data ? (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>We couldn&apos;t load these customers</AlertTitle>
          <AlertDescription className="mt-3">
            <p className="mb-3">Check your connection and try again.</p>
            <Button variant="outline" onClick={() => void query.refetch()}>
              <RefreshCw aria-hidden="true" data-icon="inline-start" />
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <DataTable
          caption="Customer directory with contact and company details"
          columns={customerColumns}
          data={tableData}
          getRowId={getCustomerRowId}
          isLoading={isInitialLoading}
          isFetching={query.isFetching && !query.isPending}
          pageSize={params.limit}
          sortColumnId="firstName"
          defaultOrder={params.order}
          emptyState={
            <Empty className="border border-dashed py-14">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Users aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>{params.q ? `No customers match “${params.q}”` : "No customers yet"}</EmptyTitle>
                <EmptyDescription>
                  {params.q
                    ? "Try another name, or clear your search to see everyone."
                    : "Add a customer to start building your directory."}
                </EmptyDescription>
              </EmptyHeader>
              {params.q ? (
                <EmptyContent>
                  <Button variant="outline" onClick={clearSearch}>
                    Clear filters
                  </Button>
                </EmptyContent>
              ) : null}
            </Empty>
          }
        />
      )}
    </section>
  );
}
