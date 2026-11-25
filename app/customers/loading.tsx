import CardSkeleton from "@/components/shared/card-skeleton";
import Loader from "@/components/shared/loader";
import TableSkeleton from "@/components/shared/table-skeleton";

export default function CustomersLoading() {
  return <main id="main-content" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><Loader /><div className="md:hidden"><CardSkeleton /></div><div className="hidden md:block"><TableSkeleton /></div></main>;
}
