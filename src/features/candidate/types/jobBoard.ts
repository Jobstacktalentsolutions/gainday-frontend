export type JobStatus = | "DRAFT" | "GENERATING" | "ACTIVE" | "UNDER_REVIEW" | "SHORTLIST_READY" | "CLOSED" | "GENERATION_FAILED";

export interface JobSalaryRange {
  min: number;
  max: number;
  currency: string;
}