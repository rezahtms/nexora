import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "@/components/ui/button";

export default function ErrorState({ onRetry, title = "We couldn't load these customers" }: { onRetry: () => void; title?: string }) {
  return (
    <section className="rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-12 text-center" role="alert">
      <AlertCircle className="mx-auto size-8 text-destructive" aria-hidden="true" />
      <h2 className="mt-3 text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">Check your connection and try again.</p>
      <Button className="mt-5 min-h-11" variant="outline" onClick={onRetry}><RefreshCw aria-hidden="true" /> Try again</Button>
    </section>
  );
}
