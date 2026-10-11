import Skeleton from "@/components/ui/skeleton";

const CardSkeleton = ({ className }: { className?: string }) => (
    <div className={`flex w-full flex-col gap-6 rounded-xl bg-white px-6 py-8 ${className ?? ""}`}>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
    </div>
);

// Mirrors CapabilityPassportView's layout so nothing jumps when the data arrives.
const CapabilityPassportSkeleton = ({ variant }: { variant: "candidate" | "employer" }) => {
    return (
        <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
            <div className="flex w-full shrink-0 flex-col gap-6 lg:w-89.5">
                <div className="flex w-full flex-col items-center gap-6 rounded-xl bg-white p-6">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="size-40 rounded-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
                {variant === "employer" && <CardSkeleton />}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-6">
                <CardSkeleton />
                <CardSkeleton />
                {variant === "candidate" && <CardSkeleton />}
                {variant === "candidate" && <CardSkeleton />}
            </div>
        </div>
    );
};

export default CapabilityPassportSkeleton;