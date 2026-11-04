import type { Timeframe } from "../hooks/useDashboardStats";

export interface ExperienceReviewSeriesPoint {
  label: string;
  /** Average rating in the bucket, or null when nobody reviewed in it. */
  average: number | null;
  count: number;
}

export interface ExperienceReviewSummary {
  timeframe: Timeframe;
  totals: {
    allTimeAverage: number | null;
    allTimeCount: number;
    periodAverage: number | null;
    periodCount: number;
  };
  series: ExperienceReviewSeriesPoint[];
}

export type ExperienceReviewRole = "JOB_SEEKER" | "EMPLOYER";

export interface ExperienceReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  role: ExperienceReviewRole;
  email: string;
  /** Candidate's full name, or the employer's company name. */
  reviewerName: string | null;
  /** The reviewer's user ID, which the admin candidate page is keyed by. */
  reviewerUserId: string;
  /** The completed assessment this rating is for. Null for ratings given before assessments were linked. */
  submissionId: string | null;
  jobId: string | null;
  jobTitle: string | null;
}
