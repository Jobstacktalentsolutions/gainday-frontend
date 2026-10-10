import { cn } from "@/lib/utils";
import Skeleton from "@/components/ui/skeleton";
import { INTEGRITY_META } from "../utils/submissionIntegrity";
import type { IntegrityStatus } from "../types/submission";

interface IntegrityCardProps {
    status: IntegrityStatus;
    checks: string[];
}

const IntegrityCard = ({ status, checks }: IntegrityCardProps) => {
    const { label, textClass, summary } = INTEGRITY_META[status];

    return (
        <section className="flex w-full flex-col gap-3 rounded-xl bg-white p-6">
            <div className="flex items-center justify-between text-sm">
                <h2 className="uppercase text-neutral-700">Integrity</h2>
                <p className={textClass}>{label}</p>
            </div>
            <ul className="flex flex-col text-xs text-neutral-300">
                {checks.map((check) => (
                    <li key={check}>{check}</li>
                ))}
            </ul>
            <p className={cn("text-sm", textClass)}>{summary}</p>
        </section>
    );
};

export const IntegrityCardSkeleton = () => {
    return (
        <div className="flex w-full flex-col gap-3 rounded-xl bg-white p-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-16 w-40" />
            <Skeleton className="h-4 w-28" />
        </div>
    );
};

export default IntegrityCard;