import Table from "@/components/ui/table";
import TableBody from "@/components/ui/table-body";
import TableCell from "@/components/ui/table-cell";
import TableHead from "@/components/ui/table-head";
import TableHeader from "@/components/ui/table-header";
import TableRow from "@/components/ui/table-row";

type DataTableSkeletonProps = {
  columnCount: number;
  rows?: number;
};

export default function DataTableSkeleton({ columnCount, rows = 6 }: DataTableSkeletonProps) {
  const safeColumnCount = Math.max(1, columnCount);
  const mobileCardCount = Math.min(rows, 4);

  return (
    <div role="status" aria-label="Loading records">
      <div className="space-y-3 md:hidden">
        {Array.from({ length: mobileCardCount }, (_, cardIndex) => (
          <div
            className="rounded-2xl border border-border/70 bg-card p-4"
            key={cardIndex}
          >
            <div className="flex items-center gap-3">
              <span className="skeleton-block size-12 rounded-full" />
              <span className="space-y-2">
                <span className="skeleton-block h-4 w-36 rounded" />
                <span className="skeleton-block h-3 w-24 rounded" />
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <span className="skeleton-block h-3 w-52 rounded" />
              <span className="skeleton-block h-3 w-40 rounded" />
              <span className="skeleton-block h-3 w-44 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm md:block">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-0 hover:bg-transparent">
              {Array.from({ length: safeColumnCount }, (_, columnIndex) => (
                <TableHead key={columnIndex}>
                  <span className="skeleton-block h-3.5 w-20 rounded" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }, (_, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-transparent">
                {Array.from({ length: safeColumnCount }, (_, columnIndex) => (
                  <TableCell key={columnIndex}>
                    <span
                      className={
                        columnIndex === 0
                          ? "skeleton-block size-10 rounded-full"
                          : "skeleton-block h-4 w-28 rounded"
                      }
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
