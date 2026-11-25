import DataTableSkeleton from "@/components/shared/data-table/data-table-skeleton";
import Loader from "@/components/shared/loader";

export default function CustomersLoading() {
  return (
    <main id="main-content" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Loader />
      <DataTableSkeleton columnCount={6} />
    </main>
  );
}
