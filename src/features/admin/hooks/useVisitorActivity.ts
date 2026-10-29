import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { Timeframe } from "./useDashboardStats";

export interface VisitorSeriesPoint {
  label: string;
  visitors: number;
  signedInUsers: number;
  /** Monthly active visitors over the 30 days ending on the point. Null on monthly charts. */
  mau: number | null;
}

export interface VisitorActivity {
  timeframe: Timeframe;
  kpis: {
    dau: number;
    signedInDau: number;
    mau: number;
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
