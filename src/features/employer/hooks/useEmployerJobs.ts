import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { getJobShareUrl } from "@/lib/shareLink";
import type { Job, JobStatus, JobStatusFilter } from "../types/job";

interface BackendJob {
    id: string;
    title: string | null;
    location: string | null;
    employmentType: string | null;
    status: JobStatus;
    createdAt: string;
    updatedAt: string;
    submissionsCount?: number;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    totalAll?: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface PaginatedEmployerJobsResponse {
    items: BackendJob[];
    pagination: PaginationMeta;
}

const POSTED_STATUSES: JobStatus[] = ["ACTIVE", "CLOSED"];

const toJob = (job: BackendJob): Job => ({
    id: job.id,
    title: job.title ?? "Untitled job",
    status: job.status,
    location: job.location ?? "Not set",
    employmentType: job.employmentType ?? "Not set",
    submissionsCount: job.submissionsCount ?? 0,
    postedAt: POSTED_STATUSES.includes(job.status) ? job.updatedAt : null,
    shareUrl: getJobShareUrl(job.id),
});

export interface EmployerJobsFilterParams {
    search?: string;
    status?: JobStatusFilter;
    page?: number;
    limit?: number;
}

export interface PaginatedJobsResult {
    jobs: Job[];
    pagination: PaginationMeta;
}

const fetchEmployerJobs = async (params?: EmployerJobsFilterParams): Promise<PaginatedJobsResult> => {
    const queryParams: Record<string, string | number> = {};
    if (params?.search?.trim()) queryParams.search = params.search.trim();
    if (params?.status && params.status !== "all") queryParams.status = params.status;
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;

    const { data } = await apiClient.get<PaginatedEmployerJobsResponse>("/jobs/mine", {
        params: queryParams,
    });

    return {
        jobs: data.items.map(toJob),
        pagination: data.pagination,
    };
};

export const useEmployerJobs = (params?: EmployerJobsFilterParams) => {
    return useQuery({
        queryKey: [
            "employer",
            "jobs",
            params?.search?.trim() ?? "",
            params?.status ?? "all",
            params?.page ?? 1,
            params?.limit ?? 9,
        ],
        queryFn: () => fetchEmployerJobs(params),
    });
};
