import { Users, ArrowRight, Link as LinkIcon, SquareArrowOutUpRight, Trash2 } from "@/components/ui/icons";
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
                if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onOpenPreview(job);
                }
            }}
            aria-label={`Open preview for ${job.title}`}
            className="flex w-full cursor-pointer flex-col gap-2 rounded-2xl bg-white p-3 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] active:shadow-sm lg:rounded-3xl lg:px-4 lg:py-4"
        >
            <div className="flex items-center justify-between gap-2">
                <StatusBadge status={job.status} />
                <div className="flex items-center gap-2">
                    {/* Delete button: only for non-live jobs (Draft, Closed, etc.) */}
                    {job.status !== "ACTIVE" && onDelete && (
                        <button
                            type="button"
                            onClick={stopAnd(() => onDelete(job))}
                            aria-label="Delete job"
                            title="Delete job"
                            className="flex size-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                            <Trash2 className="size-3.5 shrink-0" aria-hidden="true" />
                        </button>
                    )}

                    {/* Preview */}
                    <button
                        type="button"
                        onClick={stopAnd(() => onOpenPreview(job))}
                        aria-label="Open job preview"
                        title="Open job preview"
                        className="flex size-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-950 transition-colors hover:bg-neutral-50"
                    >
                        <SquareArrowOutUpRight className="size-3.5 shrink-0" aria-hidden="true" />
                    </button>

                    {/* Share */}
                    <button
                        type="button"
                        onClick={stopAnd(() => onShareLink(job))}
                        aria-label="Share job link"
                        title="Share job link"
                        className="flex size-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-950 transition-colors hover:bg-neutral-50"
                    >
                        <LinkIcon className="size-3.5 shrink-0" aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-start gap-1">
                <h3 className="text-base leading-snug text-neutral-950">{job.title}</h3>
                <JobMetaRow location={job.location} employmentType={job.employmentType} />
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
            <button
                type="button"
                onClick={stopAnd(() => onViewSubmissions(job))}
                className="flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-neutral-950 px-2.5 text-xs text-neutral-50 transition-colors hover:bg-neutral-800"
            >
                <Users className="size-4" aria-hidden="true" />
                <span>
                    {hasSubmissions ? `${job.submissionsCount} Submissions` : "Submissions"}
                </span>
                <ArrowRight className="size-4" aria-hidden="true" />
            </button>

            <p className="text-xs text-neutral-500 lg:text-sm">
                {formatPostedDate(job.postedAt)}
            </p>
            </div>

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
