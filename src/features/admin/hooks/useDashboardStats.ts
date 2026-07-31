import { useQuery } from "@tanstack/react-query";
// import { apiClient } from "@/lib/api/client";

interface DashboardStats {
    activeJobs : number;
    activeUsers : number;
    submissionsThisWeek: number ;
    jobsFilled: number;
    jobsOpen: number;
}

interface RecentJobPost {
    id : string;
    title : string;
    company : string;
    status : "active" | "pending";
}

//Mock data - matches what is expected from the backend

async function fetchDashboardStats() : Promise<{
    stats : DashboardStats;
    recentJobs: RecentJobPost[];
}> {
    //return (await apiClient.get("/admin/dashboard")).data
    return {
        stats: {
            activeJobs: 24,
            activeUsers: 312,
            submissionsThisWeek: 58,
            jobsFilled: 9,
            jobsOpen: 24,
        },
        recentJobs: [
            { 
                id : "1",
                title: "Custody OPerations Business Manager - JpMorgan", 
                company: "JPMorgan",
                status : "active"
            },
            {
                id : "2",
                title : "Finance Associate - Stanbic IBTC",
                company : "Stanbic IBTC",
                status : "pending",
            },
            {
                id : "3",
                title : "Sales Analyst - Interswitch",
                company: "Interswitch",
                status : "active"
            }
        ]
    }
}

export function useDashboardStats() {
    return useQuery({
        queryKey : ["admin", "dashboard-stats"],
        queryFn : fetchDashboardStats,
    })
}