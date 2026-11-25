"use client";

import { memo } from "react";
import TableCell from "@/components/ui/table-cell";
import TableRow from "@/components/ui/table-row";
import type { RenderedTableCell } from "@/lib/types/table.types";
import { cn } from "@/lib/utils";

type DataTableRowProps = {
  cells: readonly RenderedTableCell[];
};

function DataTableRow({ cells }: DataTableRowProps) {
  return (
    <TableRow>
      {cells.map((cell) =>
        cell.isRowHeader ? (
          <th
            key={cell.id}
            scope="row"
            className={cn("px-5 py-4 text-left align-middle font-medium", cell.className)}
          >
            {cell.content}
          </th>
        ) : (
          <TableCell key={cell.id} className={cell.className}>
            {cell.content}
          </TableCell>
        ),
      )}
    </TableRow>
  );
}

export default memo(DataTableRow);
