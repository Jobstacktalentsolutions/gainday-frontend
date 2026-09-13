import Skeleton from "@/components/ui/skeleton";

const TaskCardSkeleton = () => {
    return (
        <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-100 p-5">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-28 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
            </div>
            <div className="flex flex-col gap-5 bg-neutral-50/50 p-5">
                <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3.5 w-10" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-28 w-full rounded-xl" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-40 w-full rounded-xl" />
                </div>
            </div>
        </div>
    )
}
export default TaskCardSkeleton;