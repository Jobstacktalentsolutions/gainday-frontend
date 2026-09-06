import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, MapPin, Play } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { MOCK_JOB_PREVIEWS } from "../mocks/jobPreview";
import type { JobPreviewDetails } from "../types/jobPreview";
import type { JobStatus } from "../types/job";
import { StepContinueButton } from "@/components/ui/StepNavigationButtons";


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

    const isDraft = job.status === "DRAFT";

    return (
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">

            <BackButton onClick={() => navigate("employer/jobs")} />
            <JobPreviewHero job={job} />

            {isDraft ? (
                <ContinueEditingAction jobId={job.id} />
            ) : (
                <>
                    <LiveJobActions job={job} />
                    <StatsRow job={job} />
                </>
            )}

            <JobPreviewDetailsCard job={job} showTasks={!isDraft} />

        </div>
    )
};



const JobPreviewDetailsCard = ({ job, showTasks }: { job: JobPreviewDetails, showTasks: boolean }) => {
    <div className="flex w-full flex-col gap-6 rounded-3xl bg-white p-8">
        <Section title="DESCRIPTION">
            <p className="text-base text-neutral-950">{job.description}</p>
        </Section>

        <Divider />

        <Section title="ROLE DETAILS">
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
                <DetailField label="Category" value={job.category} />
                <DetailField label="Employment type" value={job.employmentType} />
            </div>
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
                <DetailField label="Location" value={job.location} />
                <DetailField label="Salary" value={job.salary} />
            </div>
            <DetailField label="Deadline" value={job.deadline} />
        </Section>

        <Divider />

        <Section title="REQUIRED SKILLS">
            <div className="flex flex-wrap gap-3">
                {job.requiredSkills.map((skill) => (
                    <span
                        key={skill}
                        className="rounded-2xl bg-primary-50 px-2 py-1 text-neutral-950 text-sm"
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </Section>

    </div>
}

const Divider = () => <div className="h-px w-full bg-neutral-200" />;
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-3">
        <p className="text-base text-primary-500">{title}</p>
        {children}
    </div>
);

const DetailField = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-1 flex-col gap-1.5">
        <p className="text-neutral-700 text-sm">{label}</p>
        <p className="text-base text-neutral-950">{value}</p>
    </div>
);


const LiveJobActions = ({ job }: { job: JobPreviewDetails }) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-wrap items-center gap-6">
            {/* <button
                type="button"
                // TODO: point this at the submissions route once it exists
                onClick={() => navigate(`/employer/jobs/${job.id}/submissions`)}
                className="flex h-13 items-center gap-2 rounded-lg bg-primary-500 py-1 pr-1 pl-6 text-base text-neutral-50"
            >
                View Submissions
                <span className="flex h-full w-11 items-center justify-center rounded-lg bg-secondary-500">
                    <ArrowRight className="size-4" aria-hidden="true" />
                </span>
            </button> */}
            <StepContinueButton
                // TODO: point this at the submissions route once it exists
                onClick={() => navigate(`/employer/jobs/${job.id}/submissions`)}
            >
                View Submissions
            </StepContinueButton>
            <a
                href={job.shareUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-13 items-center rounded-lg border border-primary-500 px-6 text-base text-primary-500"
            >
                Preview as a candidate
            </a>
        </div>
    );
};

const StatsRow = ({ job }: { job: JobPreviewDetails }) => (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
        <StatBox value={String(job.submissionsCount)} label="Applicants" />
        <StatBox value={job.deadline} label="Deadline" />
        <StatBox value={STATUS_LABELS[job.status]} label="Status" />
    </div>
);

const StatBox = ({ value, label }: { value: string; label: string }) => (
    <div className="flex flex-col gap-3 rounded-2xl border border-primary-200 bg-white/10 p-6">
        <p className="text-3xl text-neutral-950 tracking-tight lg:text-5xl">{value}</p>
        <p className="text-base text-neutral-700">{label}</p>
    </div>
);


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

const ContinueEditingAction = ({ jobId }: { jobId: string }) => {
    const navigate = useNavigate();
    return (
        <>

            {/* <button
                type="button"
                // TODO: point this at wherever the job posting wizard resumes an existing draft
                onClick={() => navigate(`/employer/jobs/${jobId}/edit`)}
                className="flex h-13 w-fit items-center gap-2 rounded-lg bg-primary-500 py-1 pr-1 pl-6 text-base text-neutral-50"
            >
                Continue Editing
                <span className="flex h-full w-11 items-center justify-center rounded-lg bg-secondary-500">
                    <ArrowRight className="size-4" aria-hidden="true" />
                </span>
            </button> */}
            <StepContinueButton
                // TODO: point this at wherever the job posting wizard resumes an existing draft
                onClick={() => navigate(`/employer/jobs/${jobId}/edit`)}
            >
                Continue Editing
            </StepContinueButton>
        </>
    );
};


const JobPreviewHero = ({ job }: { job: JobPreviewDetails }) => {
    const postedLabel = formatPostedDate(job.postedAt);

    return (
        <div
            className="relative w-full overflow-hidden rounded-xl p-10"
            style={{
                backgroundImage:
                    "linear-gradient(172.25deg, rgb(27, 23, 255) 1.44%, rgb(16, 14, 153) 61.68%)",
            }}
        >
            <div className="relative z-10 flex flex-col gap-10">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-['Glacial_Indifference'] text-3xl text-white tracking-tight lg:text-5xl">
                        {job.title}
                    </h1>
                    <StatusBadge status={job.status} />
                </div>
                {job.status === "DRAFT" ? (
                    <div className="flex items-center gap-4 rounded-lg border border-neutral-500 bg-neutral-50 px-6 py-4.5 drop-shadow-md">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-500 text-neutral-50 text-xs">
                            i
                        </span>
                        <p className="text-base text-neutral-900">
                            This job has not been published yet. Applicants cannot see it until you finish and publish.
                        </p>
                    </div>
                ) : (
                    postedLabel && (
                        <div className="flex flex-wrap items-center gap-4 text-base text-primary-50">
                            <span className="flex items-center gap-2">
                                <Clock className="size-6" aria-hidden="true" />
                                {postedLabel}
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-2">
                                <MapPin className="size-6" aria-hidden="true" />
                                {job.location}
                            </span>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};


const JobPreviewSkeleton = () => (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
        <div className="h-59.5 w-full animate-pulse rounded-xl bg-neutral-100" />
        <div className="h-13 w-52 animate-pulse rounded-lg bg-neutral-100" />
        <div className="h-64 w-full animate-pulse rounded-3xl bg-neutral-100" />
    </div>
);

export default JobPreview;