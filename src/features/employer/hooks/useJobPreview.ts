import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { JobStatus } from "../types/job";
import type { JobRole } from "../schemas/jobPosting";
import type { JobPreviewDetails } from "../types/jobPreview";
import type { SimulationTask } from "@/features/simulation-tasks/types";
import { fetchJobSubmissionsCount } from "./useJobSubmissionsCount";

interface BackendSalaryRange {
    min: number | null;
    max: number | null;
    currency: string;
}

interface BackendJobWithSimulation {
    id: string;
    title: string | null;
    description: string | null;
    role: JobRole | null;
    location: string | null;
    employmentType: string | null;
    isRemoteFriendly: boolean;
    requiredSkills: string[];
    salaryRange: BackendSalaryRange | null;
    applicationDeadline: string | null;
    businessProblem: string | null;
    status: JobStatus;
    updatedAt: string;
    simulation: {
        id: string;
        tasks: SimulationTask[];
        timeLimitMinutes: number;
    } | null;
}

const POSTED_STATUSES: JobStatus[] = ["ACTIVE", "SHORTLIST_READY", "INACTIVE", "TERMINATED"];

// job.role (FINANCE/SALES) is the category source — it's set at job creation and always
// available, unlike job_extractions.category which only exists once generation has run.
const CATEGORY_LABELS: Record<JobRole, string> = { FINANCE: "Finance", SALES: "Sales" };

const formatSalary = (range: BackendSalaryRange | null): string => {
    if (!range || (range.min == null && range.max == null)) return "Not disclosed";
    const format = (amount: number) =>
        new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: range.currency,
            maximumFractionDigits: 0,
        }).format(amount);

    if (range.min != null && range.max != null) return `${format(range.min)} to ${format(range.max)}`;
    return format(range.min ?? range.max ?? 0);
};

const formatDeadline = (deadline: string | null): string => {
    if (!deadline) return "Not set";
    return new Date(deadline).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const toJobPreviewDetails = (
    job: BackendJobWithSimulation,
    submissionsCount: number,
): JobPreviewDetails => ({
    id: job.id,
    title: job.title ?? "Untitled job",
    status: job.status,
    location: job.location ?? "Not set",
    employmentType: job.employmentType ?? "Not set",
    submissionsCount,
    postedAt: POSTED_STATUSES.includes(job.status) ? job.updatedAt : null,
    shareUrl: `${window.location.origin}/jobs/${job.id}`,
    description: job.description ?? "",
    category: job.role ? CATEGORY_LABELS[job.role] : "Not set",
    salary: formatSalary(job.salaryRange),
    deadline: formatDeadline(job.applicationDeadline),
    isRemoteFriendly: job.isRemoteFriendly,
    requiredSkills: job.requiredSkills,
    whatThisHireNeedsToSolve: job.businessProblem ?? "",
    tasks: job.simulation?.tasks ?? [],
});

// The backend returns 200 + null (not a 404) for a missing job id — see
// JobsService.findByIdWithSimulation — so a missing job is valid query *data*, not a query
// *error*. Keeping that distinction lets JobPreview show its "couldn't find that job" copy
// instead of a generic error state.
const fetchJobPreview = async (jobId: string): Promise<JobPreviewDetails | null> => {
    const { data: job } = await apiClient.get<BackendJobWithSimulation | null>(
        `/jobs/${jobId}/with-simulation`,
    );
    if (!job) return null;

    const submissionsCount = await fetchJobSubmissionsCount(jobId);
    return toJobPreviewDetails(job, submissionsCount);
};

export const useJobPreview = (jobId: string | undefined) => {
    return useQuery({
        queryKey: ["employer", "job-preview", jobId],
        queryFn: () => fetchJobPreview(jobId as string),
        enabled: Boolean(jobId),
        retry: false,
    });
};
