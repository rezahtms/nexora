import { UsersRound } from "lucide-react";
import Button from "@/components/ui/button";

export default function EmptyState({ title, description, actionLabel, onAction }: { title: string; description: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <section className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center" aria-live="polite">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/5 text-primary"><UsersRound aria-hidden="true" /></span>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {actionLabel && onAction ? <Button className="mt-5 min-h-11" variant="outline" onClick={onAction}>{actionLabel}</Button> : null}
    </section>
  );
}
