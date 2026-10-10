import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Skeleton from "@/components/ui/skeleton";
import { formatSubmittedDate } from "../utils/submissionFormatters";
import type { SubmissionDetail } from "../types/submission";

interface SubmissionDetailHeaderProps {
    jobId: string;
    /** Omit while loading, or when the submission couldn't be loaded. */
    submission?: Pick<SubmissionDetail, "candidateName" | "displayId" | "submittedAt" | "overallScore">;
    isLoading?: boolean;
}


const SubmissionDetailHeader = ({ jobId, submission, isLoading = false }: SubmissionDetailHeaderProps) => {
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
                            {submission.displayId} · {formatSubmittedDate(submission.submittedAt)}
                        </p>
                        <h1 className="truncate text-2xl leading-tight text-black lg:text-[28px]">
                            {submission.candidateName}
                        </h1>
                    </div>
                )}
            </div>

            {isLoading && <Skeleton className="h-12 w-24 shrink-0" />}

            {submission && (
                <div className="flex shrink-0 items-center gap-3 border-l border-primary-500 pl-3">
                    <div className="flex flex-col">
                        <p className="text-2xl leading-tight text-black lg:text-[28px]">{submission.overallScore}</p>
                        <p className="text-xs text-neutral-500 lg:text-base">OVERALL/100</p>
                    </div>
                </div>
            )}
        </header>
    );
};

export default SubmissionDetailHeader;