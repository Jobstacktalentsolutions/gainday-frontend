import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, MapPin, Play } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { MOCK_JOB_PREVIEWS } from "../mocks/jobPreviews";
import type { JobPreviewDetails, JobStatus } from "../types/jobPreview";


// TODO: replace with the real single-job fetch hook once available, e.g.
// const { data: job, isLoading } = useJobPreview(jobId);
const useJobPreviewMock = (jobId: string | undefined) => {
    const job = MOCK_JOB_PREVIEWS.find((preview) => preview.id === jobId);
    return { job, isLoading: false };
};

const formatPostedDate = (postedAt: string | null) => {
    if (!postedAt) return null;
    return `Posted ${new Date(postedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })}`;
};

const STATUS_LABELS: Record<JobStatus, string> = {
    DRAFT: "Draft",
    GENERATING: "Generating",
    ACTIVE: "Active",
    INACTIVE: "Under review",
    SHORTLIST_READY: "Shortlist ready",
    GENERATION_FAILED: "Generation failed",
    TERMINATED: "Closed",
};

const JobPreview = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const { job, isLoading } = useJobPreviewMock(jobId);

    if (isLoading) {
        return <JobPreviewSkeleton />;
    }

    if (!job) {
        return (
            <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-10">
                <BackButton onClick={() => navigate("/employer/jobs")} />
                <p className="text-base text-neutral-700">
                    We couldn't find that job. It may have been removed or the link is incorrect.
                </p>
            </div>
        )
    }
};

const BackButton = ({ onClick }: { onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2 text-base text-neutral-700 hover:text-neutral-950"
    >
        <ArrowLeft className="size-5" aria-hidden="true" />
        Back
    </button>
);

const JobPreviewSkeleton = () => (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
        <div className="h-59.5 w-full animate-pulse rounded-xl bg-neutral-100" />
        <div className="h-13 w-52 animate-pulse rounded-lg bg-neutral-100" />
        <div className="h-64 w-full animate-pulse rounded-3xl bg-neutral-100" />
    </div>
);

export default JobPreview;