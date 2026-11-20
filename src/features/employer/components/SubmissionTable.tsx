import { Link, useNavigate } from "react-router-dom";
import { Check } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import Skeleton from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import IntegrityLabel from "./IntegrityLabel";
import CategoryBreakdownBars from "./CategoryBreakdownBars";
import { CATEGORY_ORDER } from "../utils/submissionCategories";
import { formatDuration, formatSubmittedDate } from "../utils/submissionFormatters";
import { formatOverallScore, getCandidateLabel } from "../utils/submissionLabels";
import type { SubmissionSummary } from "../types/submission";
import { SELECTED_SUBMISSION_STATUS } from "../types/submission";

// Shared by the header, the rows and the skeleton so the columns always line up.
const ROW_GRID =
    "grid grid-cols-[minmax(9rem,1.6fr)_5rem_10.25rem_6rem_4.5rem_7rem_7.5rem] items-center gap-4";

const HEADERS = [
    "Candidate",
    "Overall",
    "Capability areas",
    "Application Score",
    "Time",
    "Submitted",
    "Integrity",
];

const CAPABILITY_HEADER = "Capability areas";
// "(PS | JE | WC | CD)", built from the list the bars use so the order can't drift.
const CAPABILITY_CODES = `(${CATEGORY_ORDER.map(({ short }) => short).join(" | ")})`;

const TableShell = ({ children }: { children: React.ReactNode }) => (
    <div className="hidden w-full overflow-x-auto rounded-xl border border-primary-200 bg-white lg:block">
        <div className="flex min-w-225 flex-col gap-3 p-6">
            <div className={cn(ROW_GRID, "border-b border-neutral-200 pb-3 text-base uppercase text-neutral-500")}>
                {HEADERS.map((header) => (
                    <p key={header}>
                        {header}
                        {header === CAPABILITY_HEADER && (
                            <>
                                {" "}
                                <span className="whitespace-nowrap">{CAPABILITY_CODES}</span>
                            </>
                        )}
                    </p>
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
    const navigate = useNavigate();

    return (
        <>
        <div className="flex flex-col gap-3 lg:hidden">
            {submissions.map((submission) => {
                const label = getCandidateLabel(submission);
                return (
                    <article key={submission.id} className="rounded-xl border border-neutral-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-start gap-3">
                                <Checkbox checked={selectedIds.includes(submission.id)} onCheckedChange={() => onToggleSelect(submission.id)} aria-label={`Select ${label}`} />
                                <div className="min-w-0">
                                    <Link to={`/employer/jobs/${jobId}/submissions/${submission.id}`} className="font-medium text-neutral-950 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-primary-500">{label}</Link>
                                    {submission.candidateName !== null && <p className="text-xs text-neutral-500">{submission.displayId}</p>}
                                    {(submission.isSelected || submission.status === SELECTED_SUBMISSION_STATUS) && <span className="text-xs font-medium text-success-800">Selected</span>}
                                </div>
                            </div>
                            <IntegrityLabel status={submission.integrityStatus} issueCount={submission.integrityIssueCount} />
                        </div>
                        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                            <div><dt className="text-neutral-500">Overall</dt><dd className="text-neutral-950">{formatOverallScore(submission)}</dd></div>
                            <div><dt className="text-neutral-500">Application Score</dt><dd className="text-neutral-950">{submission.capabilityScore === null ? "-" : submission.capabilityScore}</dd></div>
                            <div><dt className="text-neutral-500">Time</dt><dd className="text-neutral-950">{submission.timeTakenSeconds === null ? "-" : formatDuration(submission.timeTakenSeconds)}</dd></div>
                            <div><dt className="text-neutral-500">Submitted</dt><dd className="text-neutral-950">{formatSubmittedDate(submission.submittedAt)}</dd></div>
                        </dl>
                        {submission.categoryScores !== null && <div className="mt-4"><CategoryBreakdownBars scores={submission.categoryScores} showCodes /></div>}
                    </article>
                );
            })}
        </div>
        <TableShell>
            <div className="flex flex-col divide-y divide-neutral-200">
                {submissions.map((submission) => {
                    const isSelected = submission.isSelected || submission.status === SELECTED_SUBMISSION_STATUS;
                    const label = getCandidateLabel(submission);
                    return (
                        <div
                            key={submission.id}
                            onClick={(event) => {
                                if (event.target instanceof Element && event.target.closest("a, button, input, [role=checkbox]")) return;
                                navigate(`/employer/jobs/${jobId}/submissions/${submission.id}`);
                            }}
                            className={cn(
                                ROW_GRID,
                                "-mx-3 cursor-pointer px-3 py-3 text-base text-neutral-950 transition-colors",
                                isSelected
                                    ? "rounded-xl border border-success-200 bg-success-50/70 hover:bg-success-100/70"
                                    : "hover:bg-neutral-50",
                            )}
                        >
                            <div className="flex items-start gap-3">
                                    <Checkbox
                                        className="mt-1"
                                        checked={selectedIds.includes(submission.id)}
                                        onCheckedChange={() => onToggleSelect(submission.id)}
                                        aria-label={`Select ${label}`}
                                    />
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
                                <div className="flex h-14.25 w-41 items-center justify-center text-neutral-400">-</div>
                            )}
                            <p>{submission.capabilityScore === null ? "-" : submission.capabilityScore}</p>
                            <p>{submission.timeTakenSeconds === null ? "-" : formatDuration(submission.timeTakenSeconds)}</p>
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
        </>
    );
};

export const SubmissionsTableSkeleton = () => {
    return (
        <>
        <div className="flex flex-col gap-3 lg:hidden" aria-busy="true">
            {Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-36 w-full rounded-xl" />)}
        </div>
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
        </>
    );
};

export default SubmissionsTable;
