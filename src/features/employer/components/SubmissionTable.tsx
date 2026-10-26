import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Skeleton from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import IntegrityLabel from "./IntegrityLabel";
import CategoryBreakdownBars from "./CategoryBreakdownBars";
import { CATEGORY_ORDER } from "../utils/submissionCategories";
import { formatDuration, formatSubmittedDate } from "../utils/submissionFormatters";
import { formatOverallScore, getCandidateLabel } from "../utils/submissionLabels";
import type { SubmissionSummary } from "../types/submission";

// Shared by the header, the rows and the skeleton so the columns always line up.
const ROW_GRID =
    "grid grid-cols-[minmax(9rem,1.6fr)_5rem_10.25rem_6rem_4.5rem_7rem_7.5rem] items-center gap-4";

const HEADERS = [
    "Candidate",
    "Overall",
    `Breakdown (${CATEGORY_ORDER.map((category) => category.short).join("/")})`,
    "Capability",
    "Time",
    "Submitted",
    "Integrity",
];

const TableShell = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full overflow-x-auto rounded-xl border border-primary-200 bg-white">
        <div className="flex min-w-225 flex-col gap-3 p-6">
            <div className={cn(ROW_GRID, "border-b border-neutral-200 pb-3 text-base uppercase text-neutral-500")}>
                {HEADERS.map((header) => (
                    <p key={header}>{header}</p>
                ))}
            </div>
            {children}
        </div>
    </div>
);

interface SubmissionsTableProps {
    jobId: string;
    submissions: SubmissionSummary[];
    selectedIds: string[];
    onToggleSelect: (submissionId: string) => void;
}

const SubmissionsTable = ({ jobId, submissions, selectedIds, onToggleSelect }: SubmissionsTableProps) => {
    return (
        <TableShell>
            <div className="flex flex-col divide-y divide-neutral-200">
                {submissions.map((submission) => {
                    const isSelected = submission.isSelected || submission.status === "SELECTED";
                    const label = getCandidateLabel(submission);
                    return (
                        <div
                            key={submission.id}
                            className={cn(
                                ROW_GRID,
                                "-mx-3 px-3 py-3 text-base text-neutral-950 transition-colors",
                                isSelected
                                    ? "rounded-xl border border-success-200 bg-success-50/70 hover:bg-success-100/70"
                                    : "hover:bg-neutral-50",
                            )}
                        >
                            <div className="flex items-start gap-3">
                                {/* Only locked candidates can be unlocked, so only they get a checkbox. */}
                                {!submission.isUnlocked && (
                                    <Checkbox
                                        className="mt-1"
                                        checked={selectedIds.includes(submission.id)}
                                        onCheckedChange={() => onToggleSelect(submission.id)}
                                        aria-label={`Select ${label} to unlock`}
                                    />
                                )}
                                <div className="flex min-w-0 flex-col gap-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Link
                                            to={`/employer/jobs/${jobId}/submissions/${submission.id}`}
                                            aria-label={`View ${label}'s submission`}
                                            className="font-medium text-neutral-900 underline-offset-2 hover:text-primary-500 hover:underline focus-visible:outline-2 focus-visible:outline-primary-500"
                                        >
                                            {label}
                                        </Link>
                                        {isSelected && (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-success-200 bg-success-100 px-2 py-0.5 text-xs font-semibold text-success-800">
                                                <Check className="size-3 text-success-700" aria-hidden="true" />
                                                Selected
                                            </span>
                                        )}
                                    </div>
                                    {submission.candidateName !== null && (
                                        <p className="text-neutral-500">{submission.displayId}</p>
                                    )}
                                </div>
                            </div>
                            <p>{formatOverallScore(submission)}</p>
                            {submission.categoryScores !== null ? (
                                <CategoryBreakdownBars scores={submission.categoryScores} />
                            ) : (
                                <div className="flex h-14.25 w-41 items-center justify-center text-neutral-400">&mdash;</div>
                            )}
                            <p>{submission.capabilityScore === null ? "—" : submission.capabilityScore}</p>
                            <p>{submission.timeTakenSeconds === null ? "—" : formatDuration(submission.timeTakenSeconds)}</p>
                            <p className="whitespace-nowrap">{formatSubmittedDate(submission.submittedAt)}</p>
                            <IntegrityLabel
                                status={submission.integrityStatus}
                                issueCount={submission.integrityIssueCount}
                            />
                        </div>
                    );
                })}
            </div>
        </TableShell>
    );
};

export const SubmissionsTableSkeleton = () => {
    return (
        <TableShell>
            <div className="flex flex-col divide-y divide-neutral-200">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className={cn(ROW_GRID, "-mx-3 px-3 py-3")}>
                        <div className="flex flex-col gap-1">
                            <Skeleton className="h-5 w-28" />
                            <Skeleton className="h-5 w-16" />
                        </div>
                        <Skeleton className="h-5 w-10" />
                        <Skeleton className="h-14.25 w-41" />
                        <Skeleton className="h-5 w-14" />
                        <Skeleton className="h-5 w-8" />
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                ))}
            </div>
        </TableShell>
    );
};

export default SubmissionsTable;
