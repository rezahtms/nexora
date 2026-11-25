import Link from "next/link";
import { ArrowLeft, UserRoundX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";

export default function CustomerNotFound() {
  return (
    <main id="main-content" className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 text-center sm:px-6">
      <span className="grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground"><UserRoundX aria-hidden="true" /></span>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Customer not found</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">This customer does not exist or is no longer available.</p>
      <Button className="mt-6 min-h-11" nativeButton={false} render={<Link href={routes.customers} />}><ArrowLeft aria-hidden="true" /> Back to customers</Button>
    </main>
  );
}
