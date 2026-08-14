export type JobStatus = "draft" | "under_review" | "active" | "shortlist_ready" | "closed";
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