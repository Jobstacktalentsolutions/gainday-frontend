import { cn } from "@/lib/utils";
import type { JobStatus } from "../types/job";

const STATUS_STYLES: Record<JobStatus, { label: string; className: string }> = {
    DRAFT: { label: "Draft", className: "bg-neutral-100 text-neutral-700" },
    GENERATING: { label: "Generating", className: "bg-warning-50 text-warning-500" },
    ACTIVE: { label: "Active", className: "bg-primary-50 text-primary-500" },
    INACTIVE: { label: "Inactive", className: "bg-neutral-100 text-neutral-500" },
    SHORTLIST_READY: { label: "Shortlist ready", className: "bg-success-50 text-success-500" },
    GENERATION_FAILED: { label: "Generation failed", className: "bg-error-50 text-error-500" },
    TERMINATED: { label: "Terminated", className: "bg-error-50 text-error-500" },
};

interface StatusBadgeProps {
    status: JobStatus;
    className?: string;
}


const StatusBadge = ({ status, className }: StatusBadgeProps) => {
    const { label, className: statusClassName } = STATUS_STYLES[status];

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2 py-1 text-[10px] leading-tight",
                statusClassName,
                className
            )}
        >
            {label}
        </span>
    );
}

export default StatusBadge;