import { useNavigate } from "react-router-dom";
import { StepContinueButton } from "@/components/ui/StepNavigationButtons";
import { Check } from "lucide-react";
import { formatPostedDate, formatSalaryRange, hasSalary } from "../utils/formatters";
import type { JobBoardListing } from "../types/jobBoard";

interface JobCardProps {
    job: JobBoardListing;
    isApplied?: boolean;
    submissionUrl?: string;
    onApply: (job: JobBoardListing) => void;
    onViewSubmission?: (job: JobBoardListing) => void;
}

export function JobCard({
    job,
    isApplied = false,
    submissionUrl,
    onApply,
    onViewSubmission,
}: JobCardProps) {
    const navigate = useNavigate();

    const handleAction = () => {
        if (isApplied) {
            if (onViewSubmission) {
                onViewSubmission(job);
            } else if (submissionUrl) {
                navigate(submissionUrl);
            } else {
                onApply(job);
            }
        } else {
            onApply(job);
        }
    };

    return (
        <article
            role="button"
            tabIndex={0}
            onClick={handleAction}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleAction();
                }
            }}
            aria-label={`${isApplied ? "View submission for" : "View job"} ${job.title}`}
            className="flex flex-1 flex-col justify-between gap-3 rounded-3xl bg-white p-5 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] sm:p-6"
        >
            <div className="flex w-full flex-col items-start gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary-50 px-2 py-1 text-[10px] text-primary-500">
                        {job.roleCategory}
                    </span>
                    {isApplied && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-medium text-success-700">
                            <Check className="size-3" />
                            Applied
                        </span>
                    )}
                </div>
                <h3 className="break-words text-[18px] leading-[1.2] text-black">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[16px] text-neutral-700">
                    <span>{job.location}</span>
                    <span className="size-1 shrink-0 rounded-full bg-neutral-700" aria-hidden="true" />
                    <span>{job.employmentType}</span>
                </div>
                <p className="text-[16px] text-neutral-400">{job.employer.companyName}</p>
                {hasSalary(job.salaryRange) && <p className="text-[16px] text-black">{formatSalaryRange(job.salaryRange)}</p>}
            </div>
            <div className="h-px w-full bg-neutral-200" />
            <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-3">
                <StepContinueButton
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAction();
                    }}
                >
                    {isApplied ? "View Submission" : "Apply Now"}
                </StepContinueButton>
                <p className="text-[14px] text-neutral-400">Posted {formatPostedDate(job.createdAt)}</p>
            </div>
        </article>
    );
}

export function JobCardSkeleton() {
    return (
        <div className="flex flex-1 flex-col justify-between gap-3 rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex w-full flex-col items-start gap-2.5">
                <div className="h-5 w-16 animate-pulse rounded-full bg-neutral-200" />
                <div className="h-6 w-3/4 animate-pulse rounded-lg bg-neutral-200" />
                <div className="flex items-center gap-2">
                    <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
                    <div className="size-1 rounded-full bg-neutral-300" />
                    <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
                </div>
                <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
            </div>
            <div className="h-px w-full bg-neutral-200" />
            <div className="flex w-full items-center justify-between">
                <div className="h-10 w-28 animate-pulse rounded-xl bg-neutral-200" />
                <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
            </div>
        </div>
    );
}
