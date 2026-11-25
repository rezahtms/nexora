import Loader from "@/components/shared/loader";

export default function CustomerLoading() {
  return (
    <main id="main-content" className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Loader label="Loading customer profile" />
      <div className="mt-6 grid gap-5 md:grid-cols-2" role="status" aria-label="Loading customer details">
        {Array.from({ length: 4 }, (_, index) => (
          <section className="space-y-5 rounded-2xl border border-border/80 bg-card p-6" key={index}>
            <span className="skeleton-block h-5 w-40" />
            <span className="skeleton-block h-4 w-56" />
            <span className="skeleton-block h-4 w-36" />
          </section>
        ))}
      </div>
    </main>
  );
}
