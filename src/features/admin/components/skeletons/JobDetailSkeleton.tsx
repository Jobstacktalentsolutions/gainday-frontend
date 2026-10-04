import Skeleton from "@/components/ui/skeleton";
import DetailHeaderSkeleton from "./DetailHeaderSkeleton";
import StatCardSkeleton from "./StatCardSkeleton";
import TableSkeleton from "./TableSkeleton";

export const JobDetailSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-6 pb-12 animate-pulse">
      {/* Back Button */}
      <Skeleton className="h-4 w-48 bg-neutral-200" />

      {/* Header Card */}
      <DetailHeaderSkeleton />

      {/* Metric Cards */}
      <StatCardSkeleton count={4} />

      {/* Tab bar skeleton */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
        <Skeleton className="h-8 w-32 rounded-lg bg-neutral-200" />
        <Skeleton className="h-8 w-32 rounded-lg bg-neutral-100" />
        <Skeleton className="h-8 w-32 rounded-lg bg-neutral-100" />
      </div>

      {/* Main details box */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col gap-4 shadow-xs">
        <Skeleton className="h-5 w-48 bg-neutral-200" />
        <Skeleton className="h-4 w-full bg-neutral-100" />
        <Skeleton className="h-4 w-5/6 bg-neutral-100" />
        <Skeleton className="h-4 w-4/6 bg-neutral-100" />
      </div>

      {/* Submissions list */}
      <TableSkeleton rows={4} columns={4} showHeader={true} />
    </div>
  );
};

export default JobDetailSkeleton;
