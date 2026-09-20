import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { Job, JobStatus } from "../types/job";
import { fetchJobSubmissionsCount } from "./useJobSubmissionsCount";

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

const toJob = (job: BackendJob, submissionsCount: number): Job => ({
    id: job.id,
    title: job.title ?? "Untitled job",
    status: job.status,
    location: job.location ?? "Not set",
    employmentType: job.employmentType ?? "Not set",
    submissionsCount,
    postedAt: POSTED_STATUSES.includes(job.status) ? job.updatedAt : null,
    shareUrl: `${window.location.origin}/jobs/${job.id}`,
});

const fetchEmployerJobs = async (): Promise<Job[]> => {
    const { data } = await apiClient.get<BackendJob[]>("/jobs/mine");
    const counts = await Promise.all(data.map((job) => fetchJobSubmissionsCount(job.id)));
    return data.map((job, index) => toJob(job, counts[index]));
};

export const useEmployerJobs = () => {
    return useQuery({ queryKey: ["employer", "jobs"], queryFn: fetchEmployerJobs });
};
