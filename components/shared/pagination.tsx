import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/button";

export default function Pagination({ page, pageCount, total, onPageChange }: { page: number; pageCount: number; total: number; onPageChange: (page: number) => void }) {
  if (pageCount < 2) return <p className="text-sm text-muted-foreground">{total} {total === 1 ? "customer" : "customers"}</p>;
  return (
    <nav aria-label="Customer list pages" className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground" aria-live="polite">{total} customers · Page {page} of {pageCount}</p>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="min-h-11 min-w-11" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}><ChevronLeft aria-hidden="true" /></Button>
        <span className="min-w-16 text-center text-sm font-medium" aria-current="page">{page} / {pageCount}</span>
        <Button variant="outline" className="min-h-11 min-w-11" aria-label="Next page" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}><ChevronRight aria-hidden="true" /></Button>
      </div>
    </nav>
  );
}
