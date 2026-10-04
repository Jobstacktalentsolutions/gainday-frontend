import Skeleton from "@/components/ui/skeleton";
import StatCardSkeleton from "./StatCardSkeleton";
import TableSkeleton from "./TableSkeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-7 w-64 bg-neutral-200" />
          <Skeleton className="h-4 w-96 bg-neutral-100" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32 rounded-lg bg-neutral-200" />
          <Skeleton className="h-9 w-28 rounded-lg bg-neutral-200" />
        </div>
      </div>

      {/* 4 Primary Key Telemetry Metrics */}
      <StatCardSkeleton count={4} />

      {/* Main Analytics Chart Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-44 bg-neutral-200" />
            <Skeleton className="h-3.5 w-64 bg-neutral-100" />
          </div>
          <Skeleton className="h-8 w-40 rounded-lg bg-neutral-200" />
        </div>
        <Skeleton className="h-72 w-full rounded-xl bg-neutral-100" />
      </div>

      {/* Action Callout Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs"
          >
            <Skeleton className="size-10 rounded-xl bg-neutral-200" />
            <Skeleton className="h-5 w-3/4 bg-neutral-200" />
            <Skeleton className="h-3.5 w-full bg-neutral-100" />
            <Skeleton className="h-9 w-28 rounded-lg bg-neutral-200 mt-2" />
          </div>
        ))}
      </div>

      {/* Recent Jobs Table */}
      <TableSkeleton rows={4} columns={4} showHeader={true} />
    </div>
  );
};

export default DashboardSkeleton;
