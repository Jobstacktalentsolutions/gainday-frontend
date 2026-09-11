import { ArrowUpRight } from "lucide-react";
import { formatPostedDate, formatSalaryRange } from "../utils/formatters";
import type { JobBoardListing } from "../types/jobBoard";

interface JobCardProps {
    job: JobBoardListing;
    onApply: (job: JobBoardListing) => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
    return (
        <article className="flex flex-1 flex-col gap-3 rounded-3xl bg-white p-6">
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
                <button
                    type="button"
                    onClick={() => onApply(job)}
                    className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary-500 py-1 pl-6 pr-1 text-[16px] text-neutral-50"
                >
                    Apply Now
                    <span className="flex size-8 items-center justify-center rounded-lg bg-secondary-500">
                        <ArrowUpRight className="size-4 text-white" />
                    </span>
                </button>
                <p className="text-[14px] text-neutral-400">Posted {formatPostedDate(job.createdAt)}</p>
            </div>
        </article>
    );
}