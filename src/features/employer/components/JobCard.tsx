import { Users, ArrowRight, Link as LinkIcon, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Skeleton from "@/components/ui/skeleton";
import StatusBadge from "./StatusBadge";
import JobMetaRow from "./JobMetaRow";
import type { Job } from "../types/job";

interface JobCardProps {
    job: Job;
    onShareLink: (job: Job) => void;
    onViewSubmissions: (job: Job) => void;
    onOpenPreview: (job: Job) => void;
    onDelete?: (job: Job) => void;
}

const formatPostedDate = (postedAt: string | null) => {
    if (!postedAt) return "Not published yet";

    return `Posted ${new Date(postedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })}`

}

const JobCard = ({ job, onShareLink, onViewSubmissions, onOpenPreview, onDelete }: JobCardProps) => {

    const hasSubmissions = job.submissionsCount > 0;

    // Buttons nested inside the clickable card need to stop the click from bubbling up to the
    // card's own onClick, otherwise sharing/viewing submissions would also (re-)open the preview.
    const stopAnd = (handler: () => void) => (e: React.MouseEvent) => {
        e.stopPropagation();
        handler();
    };

    return (
        <article
            role="button"
            tabIndex={0}
            onClick={() => onOpenPreview(job)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpenPreview(job);
                }
            }}
            aria-label={`Open preview for ${job.title}`}
            className="flex w-full cursor-pointer flex-col gap-3 rounded-3xl bg-white px-3 py-6 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] active:shadow-sm lg:px-6 lg:py-8"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col items-start gap-1">
                    <StatusBadge status={job.status} />
                    <h3 className="text-lg text-neutral-950">{job.title}</h3>
                    <JobMetaRow location={job.location} employmentType={job.employmentType} />
                </div>
                <div className="flex items-center gap-2">
                    {/* Delete button: only for non-live jobs (Draft, Inactive, etc.) */}
                    {job.status !== "ACTIVE" && onDelete && (
                        <button
                            type="button"
                            onClick={stopAnd(() => onDelete(job))}
                            aria-label="Delete job"
                            title="Delete job"
                            className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-neutral-200 px-3 text-sm text-neutral-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 lg:size-10 lg:p-0"
                        >
                            <Trash2 className="size-4 shrink-0" aria-hidden="true" />
                            <span className="lg:hidden">Delete</span>
                        </button>
                    )}

                    {/* Preview button: "Open" + icon on mobile/tablet, icon-only on desktop */}
                    <button
                        type="button"
                        onClick={stopAnd(() => onOpenPreview(job))}
                        aria-label="Open job preview"
                        className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-neutral-200 px-3 text-sm text-neutral-950 transition-colors hover:bg-neutral-50 lg:size-10 lg:p-0"
                    >
                        <SquareArrowOutUpRight className="size-4 shrink-0" aria-hidden="true" />
                        <span className="lg:hidden">Open</span>
                    </button>

                    {/* Share button: "Share Link" + icon on mobile/tablet, link icon only on desktop */}
                    <button
                        type="button"
                        onClick={stopAnd(() => onShareLink(job))}
                        aria-label="Share job link"
                        className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-neutral-200 px-3 text-sm text-neutral-950 transition-colors hover:bg-neutral-50 lg:size-10 lg:p-0"
                    >
                        <LinkIcon className="size-4 shrink-0" aria-hidden="true" />
                        <span className="lg:hidden">Share Link</span>
                    </button>
                </div>

            </div>

            <button
                type="button"
                onClick={stopAnd(() => onViewSubmissions(job))}
                className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-neutral-950 px-4 text-base text-neutral-50 self-start transition-colors hover:bg-neutral-800"
            >
                <Users className="size-4" aria-hidden="true" />
                <span>
                    {hasSubmissions ? `${job.submissionsCount} Submissions` : "Submissions"}
                </span>
                <ArrowRight className="size-4" aria-hidden="true" />
            </button>

            <p className="text-base text-neutral-400">
                {formatPostedDate(job.postedAt)}
            </p>

        </article>
    )
}


export const JobCardSkeleton = () => {
    return (
        <div className="flex w-full flex-col justify-between gap-4 rounded-3xl bg-white px-3 py-6 lg:px-6 lg:py-8">
            <Skeleton className="h-3.75 w-18.75" />
            <Skeleton className="h-8 w-60.75" />
            <Skeleton className="h-7.25 w-full" />
            <Skeleton className="h-10 w-41.5" />
            <Skeleton className="h-3.75 w-43" />
        </div>
    )
}

export default JobCard;