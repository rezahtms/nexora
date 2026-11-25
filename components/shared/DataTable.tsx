"use client";

import { useCallback, useEffect, useMemo } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useQueryParams from "@/lib/hooks/useQueryParams";
import type { ColumnDef, DataTableProps, SortOrder } from "@/lib/types/table.types";
import { cn } from "@/lib/utils";

type TableQuery = {
  page?: string;
  sortBy?: string;
  order?: string;
};

type PaginationItemValue = number | "ellipsis";

function getPageCount(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

function getPaginationItems(page: number, pageCount: number): PaginationItemValue[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const items: PaginationItemValue[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);

  if (start > 2) {
    items.push("ellipsis");
  }

  for (let current = start; current <= end; current += 1) {
    items.push(current);
  }

  if (end < pageCount - 1) {
    items.push("ellipsis");
  }

  items.push(pageCount);
  return items;
}

function getSortIcon(columnId: string, sortBy: string, order: SortOrder) {
  if (columnId !== sortBy) {
    return ArrowUpDown;
  }
  return order === "asc" ? ArrowUp : ArrowDown;
}

function renderHeaderContent<TData>(
  column: ColumnDef<TData>,
  sortBy: string,
  order: SortOrder,
  onSortChange: (columnId: string) => void,
) {
  if (!column.sortable) {
    return column.header;
  }

  const isActive = sortBy === column.id;
  const ariaSort = isActive ? (order === "asc" ? "ascending" : "descending") : "none";
  const ariaLabel = isActive
    ? `Sort by ${column.header}, currently ${ariaSort}`
    : `Sort by ${column.header}`;
  const Icon = getSortIcon(column.id, sortBy, order);

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 px-3 text-xs font-semibold uppercase tracking-wide"
      aria-label={ariaLabel}
      onClick={() => onSortChange(column.id)}
    >
      {column.header}
      <Icon aria-hidden="true" data-icon="inline-end" />
    </Button>
  );
}

function DefaultEmptyState() {
  return (
    <Empty className="border border-dashed py-12">
      <EmptyHeader>
        <EmptyTitle>No records found</EmptyTitle>
        <EmptyDescription>There are no items to display right now.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function DataTableSkeletonRows({
  columns,
  rows,
}: {
  columns: readonly { id: string }[];
  rows: number;
}) {
  return (
    <>
      <div className="space-y-3 md:hidden" role="status" aria-label="Loading records">
        {Array.from({ length: Math.min(rows, 4) }, (_, index) => (
          <Card key={index}>
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-3 w-full max-w-56" />
              <Skeleton className="h-3 w-full max-w-44" />
              <Skeleton className="h-3 w-full max-w-48" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="hidden overflow-hidden rounded-2xl border border-border/80 bg-card md:block">
        <Table>
          <TableBody>
            {Array.from({ length: rows }, (_, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <TableCell key={column.id}>
                    {columnIndex === 0 ? (
                      <Skeleton className="size-10 rounded-full" />
                    ) : (
                      <Skeleton className="h-4 w-28" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function MobileCard<TData>({
  row,
  columns,
}: {
  row: TData;
  columns: readonly ColumnDef<TData>[];
}) {
  const visibleColumns = columns.filter((column) => !column.hideOnMobile);
  const leading = visibleColumns.filter((column) => column.mobileRole === "leading");
  const title = visibleColumns.filter((column) => column.mobileRole === "title");
  const details = visibleColumns.filter(
    (column) => column.mobileRole === "detail" || column.mobileRole === undefined,
  );
  const actions = visibleColumns.filter((column) => column.mobileRole === "actions");

  return (
    <Card>
      <CardContent className="p-4">
        {leading.length > 0 || title.length > 0 ? (
          <div className="flex items-center gap-3">
            {leading.map((column) => (
              <div key={column.id} className="shrink-0">
                {column.cell(row)}
              </div>
            ))}
            {title.length > 0 ? (
              <div className="min-w-0 flex-1">
                {title.map((column) => (
                  <div key={column.id} className="min-w-0">
                    {column.cell(row)}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
        {details.length > 0 ? (
          <dl className={cn("space-y-2 text-sm", leading.length > 0 || title.length > 0 ? "mt-4" : "")}
          >
            {details.map((column) => (
              <div key={column.id} className="flex min-w-0 items-center gap-2 text-muted-foreground">
                <dt className="sr-only">{column.header}</dt>
                <dd className="min-w-0 flex-1 truncate">{column.cell(row)}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {actions.length > 0 ? (
          <div className="mt-3 border-t pt-2">
            {actions.map((column) => (
              <div key={column.id}>{column.cell(row)}</div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function DataTable<TData>({
  caption,
  columns,
  data,
  getRowId,
  isLoading = false,
  isFetching = false,
  pageSize,
  sortColumnId,
  defaultOrder = "asc",
  emptyState,
  skeletonRows = 6,
}: DataTableProps<TData>) {
  const { query, setQueryParams } = useQueryParams<TableQuery>();
  const currentPage = useMemo(() => {
    const raw = Number(query.page ?? "1");
    return Number.isInteger(raw) && raw > 0 ? raw : 1;
  }, [query.page]);
  const sortBy = typeof query.sortBy === "string" ? query.sortBy : sortColumnId;
  const order: SortOrder = query.order === "desc" ? "desc" : query.order === "asc" ? "asc" : defaultOrder;

  const total = data?.total ?? 0;
  const items = data?.items ?? [];
  const pageCount = getPageCount(total, pageSize);
  const safePage = Math.min(currentPage, pageCount);
  const rangeStart = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = total === 0 ? 0 : Math.min(safePage * pageSize, total);
  const paginationItems = useMemo(() => getPaginationItems(safePage, pageCount), [pageCount, safePage]);

  const setPage = useCallback(
    (page: number) => {
      setQueryParams({ page: String(page) });
    },
    [setQueryParams],
  );

  useEffect(() => {
    if (!isLoading && data && currentPage > pageCount) {
      setPage(pageCount);
    }
  }, [currentPage, data, isLoading, pageCount, setPage]);

  const handleSortChange = useCallback(
    (columnId: string) => {
      if (columnId !== sortColumnId) {
        return;
      }
      const nextOrder: SortOrder = sortBy === columnId && order === "asc" ? "desc" : "asc";
      setQueryParams({ sortBy: columnId, order: nextOrder, page: "1" });
    },
    [order, setQueryParams, sortBy, sortColumnId],
  );

  if (isLoading) {
    return <DataTableSkeletonRows columns={columns} rows={skeletonRows} />;
  }

  if (!data || items.length === 0) {
    return <>{emptyState ?? <DefaultEmptyState />}</>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 md:hidden" aria-label={caption}>
        {items.map((row) => (
          <MobileCard key={getRowId(row)} row={row} columns={columns} />
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-border/80 bg-card md:block">
        <Table>
          <TableCaption className="sr-only">{caption}</TableCaption>
          <TableHeader>
            <TableRow>
              {columns.map((column) => {
                const isActive = sortBy === column.id;
                const ariaSort = column.sortable
                  ? isActive
                    ? order === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                  : undefined;
                return (
                  <TableHead
                    key={column.id}
                    scope="col"
                    aria-sort={ariaSort}
                    className={column.headerClassName}
                  >
                    {renderHeaderContent(column, sortBy, order, handleSortChange)}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((row) => (
              <TableRow key={getRowId(row)}>
                {columns.map((column) =>
                  column.isRowHeader ? (
                    <th
                      key={column.id}
                      scope="row"
                      className={cn("px-2 py-3 text-left align-middle font-medium", column.className)}
                    >
                      {column.cell(row)}
                    </th>
                  ) : (
                    <TableCell key={column.id} className={column.className}>
                      {column.cell(row)}
                    </TableCell>
                  ),
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
          <span>
            Showing {rangeStart}-{rangeEnd} of {total}
          </span>
          {isFetching ? <Spinner className="size-4" /> : null}
        </div>
        <Pagination className="mx-0 w-auto justify-end" aria-label="Pagination">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  if (safePage > 1) {
                    setPage(safePage - 1);
                  }
                }}
                aria-disabled={safePage <= 1}
                className={cn("min-h-11 min-w-11", safePage <= 1 ? "pointer-events-none opacity-50" : undefined)}
              />
            </PaginationItem>
            <PaginationItem className="sm:hidden">
              <span className="px-2 text-sm font-medium" aria-current="page">
                Page {safePage} of {pageCount}
              </span>
            </PaginationItem>
            {paginationItems.map((item, index) => (
              <PaginationItem key={`${item}-${index}`} className="hidden sm:list-item">
                {item === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    size="icon"
                    className="min-h-11 min-w-11"
                    isActive={item === safePage}
                    onClick={(event) => {
                      event.preventDefault();
                      setPage(item);
                    }}
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  if (safePage < pageCount) {
                    setPage(safePage + 1);
                  }
                }}
                aria-disabled={safePage >= pageCount}
                className={cn("min-h-11 min-w-11", safePage >= pageCount ? "pointer-events-none opacity-50" : undefined)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
