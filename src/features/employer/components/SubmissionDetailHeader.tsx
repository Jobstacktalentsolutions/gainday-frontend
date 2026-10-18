import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import Skeleton from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatSubmittedDate } from "../utils/submissionFormatters";
import type { SubmissionDetail } from "../types/submission";

interface SubmissionDetailHeaderProps {
    jobId: string;
    /** Omit while loading, or when the submission couldn't be loaded. */
    submission?: Pick<SubmissionDetail, "id" | "candidateName" | "displayId" | "submittedAt" | "overallScore" | "status" | "isSelected">;
    isLoading?: boolean;
    onToggleSelect?: () => void;
    isUpdatingSelect?: boolean;
}

const SubmissionDetailHeader = ({
    jobId,
    submission,
    isLoading = false,
    onToggleSelect,
    isUpdatingSelect = false,
}: SubmissionDetailHeaderProps) => {
    const isSelected = submission ? (submission.isSelected || submission.status === "SELECTED") : false;

    return (
        <header className="fixed left-0 top-0 z-40 flex w-full items-center justify-between gap-4 border-b border-b-neutral-300/50 bg-white/70 px-6 py-5 backdrop-blur-xs lg:px-12 xl:px-20">
            <div className="flex min-w-0 items-center gap-4 lg:gap-6">
                <Link
                    to={`/employer/jobs/${jobId}/submissions`}
                    className="flex h-13 shrink-0 items-center justify-center gap-2 rounded-lg border border-neutral-200 px-4 text-base text-neutral-950 transition-colors hover:bg-neutral-50 lg:px-6"
                >
                    <ArrowLeft className="size-6" aria-hidden="true" />
                    <span className="hidden sm:inline">All Submissions</span>
                    <span className="sr-only sm:hidden">All Submissions</span>
                </Link>

                {isLoading && (
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-7 w-44" />
                    </div>
                )}

                {submission && (
                    <div className="flex min-w-0 flex-col">
                        <p className="truncate text-base text-primary-500">
                            {submission.displayId} &middot; {formatSubmittedDate(submission.submittedAt)}
                        </p>
                        <div className="flex flex-wrap items-center gap-2.5">
                            {submission.candidateName && (
                                <h1 className="truncate text-2xl leading-tight text-black lg:text-[28px]">
                                    {submission.candidateName}
                                </h1>
                            )}
                            {isSelected && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-success-200 bg-success-100 px-2.5 py-0.5 text-xs font-semibold text-success-800">
                                    <Check className="size-3 text-success-700" aria-hidden="true" />
                                    Selected
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {isLoading && <Skeleton className="h-12 w-24 shrink-0" />}

            {submission && (
                <div className="flex shrink-0 items-center gap-4">
                    {onToggleSelect && (
                        <button
                            type="button"
                            onClick={onToggleSelect}
                            disabled={isUpdatingSelect}
                            className={cn(
                                "flex h-11 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold transition-colors disabled:opacity-50",
                                isSelected
                                    ? "border border-success-300 bg-success-100 text-success-800 hover:bg-success-200"
                                    : "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50",
                            )}
                        >
                            <Check className="size-4" />
                            {isSelected ? "Selected" : "Select Candidate"}
                        </button>
                    )}
                    <div className="flex shrink-0 items-center gap-3 border-l border-primary-500 pl-3">
                        <div className="flex flex-col">
                            <p className="text-2xl leading-tight text-black lg:text-[28px]">
                                {submission.overallScore === null ? "\u2014" : submission.overallScore}
                            </p>
                            <p className="text-xs text-neutral-500 lg:text-base">OVERALL/100</p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default SubmissionDetailHeader;