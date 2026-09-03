export type JobStatus =
    | "DRAFT"
    | "GENERATING"
    | "ACTIVE"
    | "INACTIVE"
    | "SHORTLIST_READY"
    | "GENERATION_FAILED"
    | "TERMINATED";
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