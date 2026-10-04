import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { AdminJobDetailResponse } from "../types/job";

async function fetchJobDetail(jobId: string): Promise<AdminJobDetailResponse> {
    const { data } = await apiClient.get<AdminJobDetailResponse>(`/admin/jobs/${jobId}`);
    return data;
}

export function useJobDetail(jobId?: string) {
    return useQuery({
        queryKey: ["admin", "job", jobId],
        queryFn: () => fetchJobDetail(jobId!),
        enabled: Boolean(jobId),
    });
}
