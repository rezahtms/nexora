"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import Button from "@/components/ui/button";
import TableHead from "@/components/ui/table-head";
import type { SortState } from "@/lib/types/table.types";
import { cn } from "@/lib/utils";

type DataTableHeaderProps = {
  columnId: string;
  header: string;
  sortable?: boolean;
  sort?: SortState;
  onSortChange?: (columnId: string) => void;
  className?: string;
};

export default function DataTableHeader({
  columnId,
  header,
  sortable = false,
  sort,
  onSortChange,
  className,
}: DataTableHeaderProps) {
  if (!sortable) {
    return (
      <TableHead scope="col" className={className}>
        {header}
      </TableHead>
    );
  }

  const isActive = sort?.columnId === columnId;
  const ariaSort = isActive ? (sort.order === "asc" ? "ascending" : "descending") : "none";
  const ariaLabel = isActive
    ? `Sort by ${header}, currently ${ariaSort}`
    : `Sort by ${header}`;

  return (
    <TableHead scope="col" aria-sort={ariaSort} className={className}>
      <Button
        type="button"
        className={cn(
          "h-auto min-h-11 p-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground",
        )}
        variant="ghost"
        onClick={() => onSortChange?.(columnId)}
        aria-label={ariaLabel}
      >
        {header}
        {isActive ? (
          sort.order === "asc" ? (
            <ArrowUp aria-hidden="true" />
          ) : (
            <ArrowDown aria-hidden="true" />
          )
        ) : (
          <ArrowUpDown aria-hidden="true" />
        )}
      </Button>
    </TableHead>
  );
}
