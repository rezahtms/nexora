import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function CustomerLoading() {
  return (
    <main id="main-content" className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex min-h-24 items-center justify-center gap-3 text-sm font-medium text-muted-foreground" role="status" aria-live="polite">
        <Spinner />
        <span>Loading customer profile</span>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index} className="border-border/80">
            <CardHeader className="space-y-3">
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
