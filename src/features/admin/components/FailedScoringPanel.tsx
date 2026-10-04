import { AdminButton } from "@/components/ui/AdminButton";
import { cn } from "@/lib/utils";
import type { FailedScoringSubmission } from "../types/aiOversight";

interface FailedScoringPanelProps {
    submissions: FailedScoringSubmission[];
    onRetry: (submission: FailedScoringSubmission) => void;
    retryingId: string | null;
}

type BadgeStyle = { container: string; dot: string; label: string };

const STATUS_STYLES: Record<FailedScoringSubmission["status"], BadgeStyle> = {
    failed: {
        container: "bg-error-50 text-error-600 border border-error-200",
        dot: "bg-error-500",
        label: "Failed",
    },
    retrying: {
        container: "bg-warning-50 text-warning-600 border border-warning-200",
        dot: "bg-warning-500",
        label: "Retrying",
    },
    resolved: {
        container: "bg-success-50 text-success-600 border border-success-200",
        dot: "bg-success-500",
        label: "Resolved",
    },
};

const FailedScoringPanel = ({
    submissions,
    onRetry,
    retryingId,
}: FailedScoringPanelProps) => {
    const active = submissions.filter((s) => s.status !== "resolved");
    const resolved = submissions.filter((s) => s.status === "resolved");
    const ordered = [...active, ...resolved];

    return (
        <section className="flex w-full flex-col gap-0 overflow-hidden rounded-[10px] border border-neutral-200 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
                <p className="text-base font-semibold text-neutral-900">
                    Failed Scoring Submissions
                </p>
                {active.length > 0 && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-error-500 px-1.5 text-[11px] font-semibold text-white">
                        {active.length}
                    </span>
                )}
            </div>

            {ordered.length === 0 && (
                <div className="px-5 py-8 text-center">
                    <p className="text-sm font-medium text-success-600">All scoring jobs are healthy</p>
                    <p className="mt-1 text-xs text-neutral-400">No failed submissions to review.</p>
                </div>
            )}

            {ordered.map((sub, index) => {
                const styles = STATUS_STYLES[sub.status];
                const isResolved = sub.status === "resolved";

                return (
                    <div
                        key={sub.id}
                        className={cn(
                            "flex w-full items-center gap-4 px-5 py-4 transition-colors",
                            index !== ordered.length - 1 && "border-b border-neutral-100",
                            isResolved ? "opacity-60" : "hover:bg-neutral-50/60"
                        )}
                    >
                        {/* Info */}
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-neutral-900">
                                    Candidate #{sub.candidateNumber} — {sub.jobTitle}
                                </p>
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                                        styles.container,
                                    )}
                                >
                                    <span className={cn("size-1.5 rounded-full", styles.dot)} />
                                    {styles.label}
                                </span>
                            </div>
                            <p className="text-xs text-neutral-500">{sub.failureReason}</p>
                        </div>

                        {/* Action */}
                        {!isResolved && (
                            <div onClick={(e) => e.stopPropagation()}>
                                <AdminButton
                                    id={`retry-scoring-${sub.id}`}
                                    variant="primary"
                                    size="sm"
                                    disabled={retryingId === sub.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRetry(sub);
                                    }}
                                >
                                    {retryingId === sub.id ? (
                                        <span className="flex items-center gap-1.5">
                                            <svg className="size-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                            </svg>
                                            Retrying…
                                        </span>
                                    ) : "Retry Scoring"}
                                </AdminButton>
                            </div>
                        )}

                        {isResolved && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success-600">
                                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                                Resolved
                            </span>
                        )}
                    </div>
                );
            })}
        </section>
    );
};

export default FailedScoringPanel;
