import { cn } from "@/lib/utils";

type Status = "active" | "pending" | "flagged";

interface StatusBadgeProps {
    status: Status;
    label?: string;
}

const statusStyles: Record<Status, string> = {
    active: "bg-success-500 text-white",
    pending: "bg-warning-500 text-white",
    flagged: "bg-error-500 text-white",
}

const defaultLabels: Record<Status, string> = {
    active: "Active",
    pending: "Pending",
    flagged: "Flagged",
}

const StatusBadge = ({ status, label }: StatusBadgeProps) => {
    return (
        <span
            className={cn("inline-flex shrink-0 items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap", statusStyles[status])}
        >
            {label ?? defaultLabels[status]}
        </span>
    );
}

export default StatusBadge;