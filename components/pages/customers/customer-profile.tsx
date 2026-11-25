import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CustomerDetail from "@/components/pages/customers/customer-detail";
import CustomerDetailActions from "@/components/pages/customers/customer-detail-actions";
import CustomerIdentity from "@/components/pages/customers/customer-identity";

export default function CustomerProfile({ id, backHref }: { id: number; backHref: string }) {
  return (
    <main id="main-content" className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6"><Link href={backHref} className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ArrowLeft className="size-4" aria-hidden="true" /> Back to customers</Link></nav>
      <header className="flex flex-col gap-5 rounded-3xl border border-border/80 bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <CustomerIdentity id={id} />
        <CustomerDetailActions id={id} />
      </header>
      <CustomerDetail id={id} backHref={backHref} />
    </main>
  );
}
