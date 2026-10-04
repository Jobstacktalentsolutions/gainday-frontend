import { cn } from "@/lib/utils";

export type Status = "active" | "pending" | "flagged" | "suspended" | "live" | "draft" | "closed";

interface StatusBadgeProps {
    status: Status;
    label?: string;
}

const statusStyles: Record<Status, string> = {
    active: "bg-success-500 text-white",
    live: "bg-success-500 text-white",
    pending: "bg-warning-500 text-white",
    draft: "bg-warning-500 text-white",
    flagged: "bg-error-500 text-white",
    suspended: "bg-neutral-700 text-white",
    closed: "bg-neutral-600 text-white",
};

const defaultLabels: Record<Status, string> = {
    active: "Active",
    live: "Live",
    pending: "Pending",
    draft: "Draft",
    flagged: "Flagged",
    suspended: "Suspended",
    closed: "Closed",
};

const StatusBadge = ({ status, label }: StatusBadgeProps) => {
    return (
        <span
            className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
                statusStyles[status] || "bg-neutral-500 text-white"
            )}
        >
            {label ?? defaultLabels[status] ?? status}
        </span>
    );
};

export default StatusBadge;