"use client";

import ErrorState from "@/components/shared/error-state";

export default function CustomersError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main id="main-content" className="mx-auto max-w-3xl px-4 py-16 sm:px-6"><h1 className="sr-only">Customer workspace error</h1><ErrorState title="Something went wrong" onRetry={reset} /></main>;
}
