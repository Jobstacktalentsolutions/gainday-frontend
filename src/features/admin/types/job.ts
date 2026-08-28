export type JobStatus = "live" | "draft" | "closed";

export interface AdminJob {
  id: string;
  title: string;
  company: string;
  applicantCount: number;
  status: JobStatus;
}