import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { Timeframe } from "./useDashboardStats";

/** Distinct visitors in each audience, with the total across all of them. */
export interface AudienceCounts {
  total: number;
  anonymous: number;
  jobSeeker: number;
  employer: number;
}

export interface VisitorSeriesPoint {
  label: string;
  /** Active visitors on the day. Null on monthly charts, which only carry monthly numbers. */
  dau: AudienceCounts | null;
  /** Active visitors over the 30 days ending on the point, or over the month on monthly charts. */
  mau: AudienceCounts;
}

export interface VisitorActivity {
  timeframe: Timeframe;
  kpis: {
    dau: AudienceCounts;
    mau: AudienceCounts;
    stickiness: number;
    newVisitors: number;
    totalVisitors: number;
    sessions: number;
    pageViews: number;
  };
  series: VisitorSeriesPoint[];
}

export function useVisitorActivity(timeframe: Timeframe) {
  return useQuery({
    queryKey: ["admin", "visitor-activity", timeframe],
    queryFn: async () => {
      const { data } = await apiClient.get<VisitorActivity>("/admin/analytics/visitors", {
        params: { timeframe },
      });
      return data;
    },
    staleTime: 30_000,
  });
}
