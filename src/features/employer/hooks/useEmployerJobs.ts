import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { Job, JobStatus } from "../types/job";

interface BackendJob {
    id: string;
    title: string | null;
    location: string | null;
    employmentType: string | null;
    status: JobStatus;
    createdAt: string;
    updatedAt: string;
}

const POSTED_STATUSES: JobStatus[] = ["ACTIVE", "SHORTLIST_READY", "INACTIVE", "TERMINATED"];

const toJob = (job: BackendJob): Job => ({
    id: job.id,
    title: job.title ?? "Untitled job",
    status: job.status,
    location: job.location ?? "Not set",
    employmentType: job.employmentType ?? "Not set",
    submissionsCount: 0,
    postedAt: POSTED_STATUSES.includes(job.status) ? job.updatedAt : null,
    shareUrl: `${window.location.origin}/jobs/${job.id}`,
});

const fetchEmployerJobs = async (): Promise<Job[]> => {
    const { data } = await apiClient.get<BackendJob[]>("/jobs/mine");
    return data.map(toJob);
};

export const useEmployerJobs = () => {
    return useQuery({ queryKey: ["employer", "jobs"], queryFn: fetchEmployerJobs });
};
