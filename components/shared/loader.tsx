export default function Loader({ label = "Loading customers" }: { label?: string }) {
  return (
    <div className="flex min-h-32 items-center justify-center gap-3 text-sm font-medium text-muted-foreground" role="status" aria-live="polite">
      <span className="loader-ring" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
