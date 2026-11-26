"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function CustomersError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="sr-only">Customer workspace error</h1>
      <Alert variant="destructive">
        <AlertCircle aria-hidden="true" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription className="mt-3">
          <p className="mb-3">We couldn&apos;t load this workspace. Please try again.</p>
          <Button variant="outline" onClick={reset}>
            <RefreshCw aria-hidden="true" data-icon="inline-start" />
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    </main>
  );
}
