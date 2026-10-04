import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export interface DashboardStats {
    activeJobs: number;
    totalUsers: number;
    openSubmissions: number;
    jobsFilled: number;
}

export interface RecentJobPost {
    id: string;
    title: string;
    company: string;
    status: "active" | "pending";
}

async function fetchDashboardStats(): Promise<{
    stats: DashboardStats;
    recentJobs: RecentJobPost[];
}> {
    const { data } = await apiClient.get<{
        stats: DashboardStats;
        recentJobs: RecentJobPost[];
    }>("/admin/stats");
    return data;
}

export function useDashboardStats() {
    return useQuery({
        queryKey: ["admin", "dashboard-stats"],
        queryFn: fetchDashboardStats,
    });
}