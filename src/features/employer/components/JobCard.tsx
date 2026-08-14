import { Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Skeleton from "@/components/ui/skeleton";
import StatusBadge from "./StatusBadge";
import JobMetaRow from "./JobMetaRow";
import type { Job } from "../types/job";

interface JobCardProps {
    job: Job;
    onShareLink: (job: Job) => void;
    onViewSubmissions: (job: Job) => void;
}

const formatPostedDate = (postedAt: string | null) => {
    if (!postedAt) return "Not published yet";

    return `Posted ${new Date(postedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })}`

}

const JobCard = ({ job, onShareLink, onViewSubmissions }: JobCardProps) => {

    const hasSubmissions = job.submissionsCount > 0;
    return (
        <article className="flex w-full flex-col gap-3 rounded-3xl bg-white px-3 py-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col items-start gap-1">
                    <StatusBadge status={job.status} />
                    <h3 className="text-lg text-neutral-950">{job.title}</h3>
                    <JobMetaRow location={job.location} employmentType={job.employmentType} />
                </div>
                <button
                    type="button"
                    onClick={() => onShareLink(job)}
                    className="flex h-10 shrink-0 items-center justify-center rounded-full border-neutral-100 px-3  text-base text-neutral-950"
                >
                    Share Link

                </button>
            </div>

            <button
                type="button"
                disabled={!hasSubmissions}
                onClick={() => onViewSubmissions(job)}
                className ={cn(
                    "flex h-10 items-center justify-center gap-2 rounded-lg bg-neutral-950 px-4 text-base text-neutral-50",
                    !hasSubmissions && "cursor-not-allowed opacity-80"
                )}
            >
                <Users className="size-4" aria-hidden ="true" />
                <span>
                    {hasSubmissions ? `${job.submissionsCount} Submissions` : "Submissions"}
                </span>
                <ArrowRight className ="size-4" aria-hidden="true" />
            </button>

            <p className ="text-base text-neutral-400">
                {formatPostedDate(job.postedAt)}
            </p>

        </article>
    )
}


export const JobCardSkeleton = () => {
    return (
        <div>
            <Skeleton className ="h-[15px] w-[75px]" />
        </div>
    )
}

export default JobCard;