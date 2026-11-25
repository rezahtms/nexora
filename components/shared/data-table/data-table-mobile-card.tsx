"use client";

import { memo } from "react";
import type { RenderedTableCell } from "@/lib/types/table.types";

type DataTableMobileCardProps = {
  cells: readonly RenderedTableCell[];
};

function DataTableMobileCard({ cells }: DataTableMobileCardProps) {
  const visibleCells = cells.filter((cell) => !cell.hideOnMobile);
  const leadingCells = visibleCells.filter((cell) => cell.mobileRole === "leading");
  const titleCells = visibleCells.filter((cell) => cell.mobileRole === "title");
  const detailCells = visibleCells.filter(
    (cell) => cell.mobileRole === "detail" || cell.mobileRole === undefined,
  );
  const actionCells = visibleCells.filter((cell) => cell.mobileRole === "actions");

  return (
    <article className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
      {leadingCells.length > 0 || titleCells.length > 0 ? (
        <div className="flex items-center gap-3">
          {leadingCells.map((cell) => (
            <div key={cell.id} className="shrink-0">
              {cell.content}
            </div>
          ))}
          {titleCells.length > 0 ? (
            <div className="min-w-0 flex-1">
              {titleCells.map((cell) => (
                <div key={cell.id}>{cell.content}</div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      {detailCells.length > 0 ? (
        <dl className={leadingCells.length > 0 || titleCells.length > 0 ? "mt-4 space-y-2 text-sm" : "space-y-2 text-sm"}>
          {detailCells.map((cell) => (
            <div key={cell.id} className="flex min-w-0 items-center gap-2 text-muted-foreground">
              <dt className="sr-only">{cell.header}</dt>
              <dd className="min-w-0 flex-1 truncate">{cell.content}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {actionCells.length > 0 ? (
        <div className="mt-3 border-t border-border/70 pt-2">
          {actionCells.map((cell) => (
            <div key={cell.id}>{cell.content}</div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default memo(DataTableMobileCard);
