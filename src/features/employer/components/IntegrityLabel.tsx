import { cn } from "@/lib/utils";
import { INTEGRITY_META } from "../utils/submissionIntegrity";
import type { IntegrityStatus } from "../types/submission";

interface IntegrityLabelProps {
    status: IntegrityStatus;
    className?: string;
}

const IntegrityLabel = ({ status, className }: IntegrityLabelProps) => {
    const { label, textClass } = INTEGRITY_META[status];
    return <span className={cn("whitespace-nowrap text-base", textClass, className)}>{label}</span>;
};

export default IntegrityLabel;