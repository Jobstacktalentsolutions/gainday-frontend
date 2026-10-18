import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import Skeleton from "@/components/ui/skeleton";
import { INTEGRITY_META, formatIntegrityEvent } from "../utils/submissionIntegrity";
import type { IntegrityEventSummary, IntegrityStatus } from "../types/submission";

const STATUS_ICON: Record<IntegrityStatus, typeof Shield> = {
    CLEAN: ShieldCheck,
    PENDING: Shield,
    MINOR_FLAGS: ShieldAlert,
    REVIEW_NEEDED: ShieldAlert,
};

interface IntegrityCardProps {
    status: IntegrityStatus;
    events: IntegrityEventSummary[];
}

const MONITORED_CHECKS = [
    "Full-screen enforced",
    "Tab-switch monitoring",
    "Idle detection",
    "Window-focus monitoring",
];

const IntegrityCard = ({ status, events }: IntegrityCardProps) => {
    const { label, textClass, summary } = INTEGRITY_META[status];
    const StatusIcon = STATUS_ICON[status];

    return (
        <section className="flex w-full flex-col gap-3 rounded-xl bg-white p-6">
            <div className="flex items-center justify-between text-sm">
                <h2 className="font-medium uppercase tracking-wider text-neutral-700">Integrity</h2>
                <p className={cn("font-medium", textClass)}>{label}</p>
            </div>
            <ul className="flex flex-col gap-1.5 text-base text-neutral-900">
                {events.length === 0 ? (
                    MONITORED_CHECKS.map((check) => (
                        <li key={check} className="text-neutral-600">
                            {check}
                        </li>
                    ))
                ) : (
                    events.map((event) => (
                        <li key={event.type} className="font-medium text-neutral-900">
                            {formatIntegrityEvent(event)}
                        </li>
                    ))
                )}
            </ul>
            <div className={cn("flex items-center gap-2 text-base font-medium", textClass)}>
                <StatusIcon className="size-5 shrink-0" aria-hidden="true" />
                <p>{summary}</p>
            </div>
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