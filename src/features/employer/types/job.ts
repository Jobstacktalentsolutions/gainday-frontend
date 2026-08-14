export type JobStatus = "draft" | "under review" | "active" | "shortlist ready" | "closed";
export type JobStatusFilter = "all" | JobStatus;

export interface Job {
    id: string;
    title: string;
    status: JobStatus;
    location: string;
    employmentType: string;
    submissionsCount: number;
    postedAt: string | null;
    shareUrl: string;
}