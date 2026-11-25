export default function TableSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading customer records">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="flex h-[76px] items-center gap-4 rounded-xl border border-border/70 bg-card px-5" key={index}>
          <span className="skeleton-block size-10 rounded-full" />
          <span className="skeleton-block h-4 w-36" />
          <span className="skeleton-block ml-auto h-4 w-48" />
          <span className="skeleton-block hidden h-4 w-28 md:block" />
        </div>
      ))}
    </div>
  );
}
