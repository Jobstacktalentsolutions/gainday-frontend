import Skeleton from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export const TableSkeleton = ({
  rows = 5,
  columns = 4,
  showHeader = true,
}: TableSkeletonProps) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs">
      {showHeader && (
        <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/70 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-32 bg-neutral-200" />
            <Skeleton className="h-5 w-16 rounded-full bg-neutral-200" />
          </div>
          <Skeleton className="h-8 w-48 rounded-lg bg-neutral-200" />
        </div>
      )}

      <div className="divide-y divide-neutral-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center justify-between px-5 py-4"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <Skeleton className="size-10 shrink-0 rounded-full bg-neutral-200" />
              <div className="flex flex-col gap-1.5 flex-1 min-w-0 max-w-xs">
                <Skeleton className="h-4 w-3/4 bg-neutral-200" />
                <Skeleton className="h-3 w-1/2 bg-neutral-100" />
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-6 flex-1 justify-around">
              {Array.from({ length: columns - 2 }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className="h-3.5 w-24 bg-neutral-150"
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-full bg-neutral-200" />
              <Skeleton className="h-8 w-20 rounded-lg bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
