import { cn } from "@/lib/utils";
import { INTEGRITY_META } from "../utils/submissionIntegrity";
import type { IntegrityStatus } from "../types/submission";

interface IntegrityLabelProps {
    status: IntegrityStatus;
    issueCount?: number | null;
    className?: string;
}

const IntegrityLabel = ({ status, issueCount, className }: IntegrityLabelProps) => {
    const { label, textClass, summary } = INTEGRITY_META[status];

    const displayText =
        status === "PENDING"
            ? label
            : issueCount !== undefined && issueCount !== null
              ? `${issueCount} ${issueCount === 1 ? "issue" : "issues"}`
              : label;

    return (
        <span
            title={summary}
            className={cn("whitespace-nowrap text-base", textClass, className)}
        >
            {displayText}
        </span>
    );
};

export default IntegrityLabel;