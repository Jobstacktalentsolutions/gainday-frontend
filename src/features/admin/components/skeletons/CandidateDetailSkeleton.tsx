import Skeleton from "@/components/ui/skeleton";
import DetailHeaderSkeleton from "./DetailHeaderSkeleton";
import StatCardSkeleton from "./StatCardSkeleton";
import TableSkeleton from "./TableSkeleton";

export const CandidateDetailSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-6 pb-12 animate-pulse">
      {/* Back Button */}
      <Skeleton className="h-4 w-48 bg-neutral-200" />

      {/* Header Card */}
      <DetailHeaderSkeleton />

      {/* Metric Cards */}
      <StatCardSkeleton count={4} />

      {/* Submissions Section */}
      <TableSkeleton rows={4} columns={5} showHeader={true} />
    </div>
  );
};

export default CandidateDetailSkeleton;
