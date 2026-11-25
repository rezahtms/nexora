import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function CustomersLoading() {
  return (
    <main id="main-content" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex min-h-24 items-center justify-center gap-3 text-sm font-medium text-muted-foreground" role="status" aria-live="polite">
        <Spinner />
        <span>Loading customers</span>
      </div>
      <div className="space-y-3 md:hidden" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
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
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="hidden overflow-hidden rounded-2xl border border-border/80 bg-card md:block" aria-hidden="true">
        <div className="space-y-4 p-6">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex items-center gap-4">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
