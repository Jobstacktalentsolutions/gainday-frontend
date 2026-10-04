import { StepContinueButton } from "@/components/ui/StepNavigationButtons";
import { Check } from "lucide-react";
import { formatPostedDate, formatSalaryRange } from "../utils/formatters";
import type { JobBoardListing } from "../types/jobBoard";

interface JobCardProps {
    job: JobBoardListing;
    isApplied?: boolean;
    onApply: (job: JobBoardListing) => void;
}

export function JobCard({ job, isApplied = false, onApply }: JobCardProps) {
    return (
        <article
            role={isApplied ? "article" : "button"}
            tabIndex={isApplied ? undefined : 0}
            onClick={() => {
                if (!isApplied) onApply(job);
            }}
            onKeyDown={(e) => {
                if (!isApplied && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onApply(job);
                }
            }}
            aria-label={`View job ${job.title}`}
            className={`flex flex-1 flex-col justify-between gap-3 rounded-3xl bg-white p-6 transition-all duration-150 ${
                isApplied
                    ? "cursor-default opacity-90"
                    : "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]"
            }`}
        >
            <div className="flex w-full flex-col items-start gap-2">
                <span className="rounded-full bg-primary-50 px-2 py-1 text-[10px] text-primary-500">
                    {job.roleCategory}
                </span>
                <h3 className="text-[18px] leading-[1.2] text-black">{job.title}</h3>
                <div className="flex items-center gap-1 text-[16px] text-neutral-700">
                    <span>{job.location}</span>
                    <span className="size-1 rounded-full bg-neutral-700" aria-hidden="true" />
                    <span>{job.employmentType}</span>
                </div>
                <p className="text-[16px] text-neutral-400">{job.employer.companyName}</p>
                <p className="text-[16px] text-black">{formatSalaryRange(job.salaryRange)}</p>
            </div>
            <div className="h-px w-full bg-neutral-200" />
            <div className="flex w-full items-center justify-between">
                <StepContinueButton
                    disabled={isApplied}
                    icon={isApplied ? <Check className="size-4" /> : undefined}
                    className={
                        isApplied
                            ? "disabled:bg-neutral-200 disabled:text-neutral-500 disabled:opacity-100 disabled:shadow-none pointer-events-none"
                            : undefined
                    }
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isApplied) onApply(job);
                    }}
                >
                    {isApplied ? "Applied" : "Apply Now"}
                </StepContinueButton>
                <p className="text-[14px] text-neutral-400">Posted {formatPostedDate(job.createdAt)}</p>
            </div>
        </article>
    );
}