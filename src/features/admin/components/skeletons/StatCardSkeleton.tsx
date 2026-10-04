import Skeleton from "@/components/ui/skeleton";

interface StatCardSkeletonProps {
  count?: number;
}

export const StatCardSkeleton = ({ count = 4 }: StatCardSkeletonProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-2.5 rounded-xl border border-neutral-200 bg-white p-4.5 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-24 bg-neutral-200" />
            <Skeleton className="size-5 rounded-md bg-neutral-200" />
          </div>
          <Skeleton className="h-7 w-16 bg-neutral-200 mt-1" />
          <Skeleton className="h-3 w-32 bg-neutral-100" />
        </div>
      ))}
    </div>
  );
};

export default StatCardSkeleton;
