import Skeleton from "@/components/ui/skeleton";

export const DetailHeaderSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 shrink-0 rounded-2xl bg-neutral-200" />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-6 w-48 bg-neutral-200" />
              <Skeleton className="h-5 w-20 rounded-full bg-neutral-200" />
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-36 bg-neutral-100" />
              <Skeleton className="h-4 w-28 bg-neutral-100" />
              <Skeleton className="h-4 w-24 bg-neutral-100" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-28 rounded-lg bg-neutral-200" />
          <Skeleton className="h-9 w-32 rounded-lg bg-neutral-200" />
        </div>
      </div>
    </div>
  );
};

export default DetailHeaderSkeleton;
