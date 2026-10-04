import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export type Timeframe = "day" | "week" | "month" | "year" | "all";

export interface DashboardStats {
  activeJobs: number;
  totalUsers: number;
  employersCount: number;
  candidatesCount: number;
  totalSubmissions: number;
  openSubmissions: number;
  scoredSubmissions: number;
  jobsFilled: number;
  flaggedAntiCheatCount: number;
  pendingReviewsCount: number;
}

export interface AnalyticsDataPoint {
  label: string;
  applications: number;
  submissions: number;
  total: number;
}

export interface RecentJobPost {
  id: string;
  title: string;
  company: string;
  applicantsCount: number;
  status: "active" | "pending";
}

export interface DashboardStatsResponse {
  stats: DashboardStats;
  analytics: AnalyticsDataPoint[];
  timeframe: Timeframe;
  recentJobs: RecentJobPost[];
}

async function fetchDashboardStats(
  timeframe: Timeframe = "month"
): Promise<DashboardStatsResponse> {
  const { data } = await apiClient.get<DashboardStatsResponse>("/admin/stats", {
    params: { timeframe },
  });
  return data;
}

export function useDashboardStats(timeframe: Timeframe = "month") {
  return useQuery({
    queryKey: ["admin", "dashboard-stats", timeframe],
    queryFn: () => fetchDashboardStats(timeframe),
    staleTime: 30_000,
  });
}