import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import Skeleton from "@/components/ui/skeleton";
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
}

const SubmissionsTable = ({ jobId, submissions }: SubmissionsTableProps) => {
    return (
        <TableShell>
            <div className="flex flex-col divide-y divide-neutral-200">
                {submissions.map((submission) => (
                    // The whole row is one real link, so it works with the keyboard, middle-click
                    // and "open in new tab" without any click-handler plumbing.
                    <Link
                        key={submission.id}
                        to={`/employer/jobs/${jobId}/submissions/${submission.id}`}
                        aria-label={`View ${getCandidateLabel(submission)}'s submission`}
                        className={cn(
                            ROW_GRID,
                            "-mx-3 px-3 py-3 text-base text-neutral-950 transition-colors hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-primary-500",
                        )}
                    >
                        <div className="flex flex-col gap-1">
                            <p className="text-neutral-900">{getCandidateLabel(submission)}</p>
                            {submission.candidateName !== null && (
                                <p className="text-neutral-500">{submission.displayId}</p>
                            )}
                        </div>
                        <p>{formatOverallScore(submission)}</p>
                        {submission.categoryScores !== null ? (
                            <CategoryBreakdownBars scores={submission.categoryScores} />
                        ) : (
                            <div className="flex h-14.25 w-41 items-center justify-center text-neutral-400">&mdash;</div>
                        )}
                        <p>{submission.capabilityScore === null ? "\u2014" : submission.capabilityScore}</p>
                        <p>{submission.timeTakenSeconds === null ? "\u2014" : formatDuration(submission.timeTakenSeconds)}</p>
                        <p className="whitespace-nowrap">{formatSubmittedDate(submission.submittedAt)}</p>
                        <IntegrityLabel status={submission.integrityStatus} />
                    </Link>
                ))}
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