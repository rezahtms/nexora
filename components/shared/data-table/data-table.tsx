"use client";

import { useMemo } from "react";
import DataTableEmpty from "@/components/shared/data-table/data-table-empty";
import DataTableHeader from "@/components/shared/data-table/data-table-header";
import DataTableMobileCard from "@/components/shared/data-table/data-table-mobile-card";
import DataTableRow from "@/components/shared/data-table/data-table-row";
import DataTableSkeleton from "@/components/shared/data-table/data-table-skeleton";
import Table from "@/components/ui/table";
import TableBody from "@/components/ui/table-body";
import TableCaption from "@/components/ui/table-caption";
import TableHeader from "@/components/ui/table-header";
import TableRow from "@/components/ui/table-row";
import type { DataTableProps, RenderedTableCell } from "@/lib/types/table.types";

type RenderedRow = {
  id: string | number;
  cells: RenderedTableCell[];
};

export default function DataTable<TData>({
  caption,
  columns,
  data,
  getRowId,
  isLoading = false,
  sort,
  onSortChange,
  emptyState,
  skeletonRows = 6,
}: DataTableProps<TData>) {
  const renderedRows = useMemo<RenderedRow[]>(
    () =>
      data.map((row) => ({
        id: getRowId(row),
        cells: columns.map((column) => ({
          id: column.id,
          header: column.header,
          content: column.cell ? column.cell(row) : column.accessor ? column.accessor(row) : null,
          className: column.className,
          isRowHeader: column.isRowHeader,
          hideOnMobile: column.hideOnMobile,
          mobileRole: column.mobileRole,
        })),
      })),
    [columns, data, getRowId],
  );

  if (isLoading) {
    return <DataTableSkeleton columnCount={columns.length} rows={skeletonRows} />;
  }

  if (data.length === 0) {
    return <>{emptyState ?? <DataTableEmpty />}</>;
  }

  return (
    <>
      <div className="space-y-3 md:hidden" aria-label={caption}>
        {renderedRows.map((row) => (
          <DataTableMobileCard key={row.id} cells={row.cells} />
        ))}
      </div>
      <div className="hidden overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm md:block">
        <Table>
          <TableCaption className="sr-only">{caption}</TableCaption>
          <TableHeader className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <TableRow className="border-0 hover:bg-transparent">
              {columns.map((column) => (
                <DataTableHeader
                  key={column.id}
                  columnId={column.id}
                  header={column.header}
                  sortable={column.sortable}
                  sort={sort}
                  onSortChange={onSortChange}
                  className={column.headerClassName}
                />
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderedRows.map((row) => (
              <DataTableRow key={row.id} cells={row.cells} />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
