import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { JobPreviewDetails } from "../types/jobPreview";
import { fetchJobSubmissionsCount } from "./useJobSubmissionsCount";
import type { BackendJobWithSimulation, BackendSalaryRange, JobStatus } from "../types/job";

const POSTED_STATUSES: JobStatus[] = ["ACTIVE", "CLOSED"];

// Only a positive amount counts as entered: null and 0 both mean "not provided".
const toSalaryAmount = (amount: number | null): number | null => (amount !== null && amount > 0 ? amount : null);

const formatSalary = (range: BackendSalaryRange | null): string | null => {
    if (!range) return null;
    const min = toSalaryAmount(range.min);
    const max = toSalaryAmount(range.max);
    const single = min ?? max;
    if (single === null) return null;

    const currency = range.currency === "USD" || !range.currency ? "GBP" : range.currency;
    const format = (amount: number) =>
        new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
        }).format(amount);

    if (min !== null && max !== null) return `${format(min)} to ${format(max)}`;
    return format(single);
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
    shareUrl: `${window.location.origin}/job-board/${job.id}`,
    description: job.description ?? "",
    category: job.role ?? "Not set",
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
