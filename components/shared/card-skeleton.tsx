export default function CardSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading customer cards">
      {Array.from({ length: 4 }, (_, index) => (
        <div className="rounded-2xl border border-border/70 bg-card p-4" key={index}>
          <div className="flex items-center gap-3"><span className="skeleton-block size-12 rounded-full" /><span className="space-y-2"><span className="skeleton-block h-4 w-36" /><span className="skeleton-block h-3 w-24" /></span></div>
          <div className="mt-4 space-y-3"><span className="skeleton-block h-3 w-52" /><span className="skeleton-block h-3 w-40" /><span className="skeleton-block h-3 w-44" /></div>
        </div>
      ))}
    </div>
  );
}
