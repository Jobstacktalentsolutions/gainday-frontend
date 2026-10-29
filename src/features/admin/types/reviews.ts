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
}
