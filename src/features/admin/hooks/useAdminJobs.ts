import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { AdminJob } from "../types/job";

async function fetchAdminJobs(): Promise<AdminJob[]> {
    const { data } = await apiClient.get<AdminJob[]>("/admin/jobs");
    return data;
}

async function removeJobPost(jobId: string): Promise<string> {
    await apiClient.delete(`/admin/jobs/${jobId}`);
    return jobId;
}

async function updateJobStatus(payload: { jobId: string; status: string }): Promise<void> {
    await apiClient.put(`/admin/jobs/${payload.jobId}/status`, { status: payload.status });
}

export function useAdminJobs() {
    return useQuery({
        queryKey: ["admin", "jobs"],
        queryFn: fetchAdminJobs,
    });
}

export function useRemoveJobPost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: removeJobPost,
        onSuccess: (removedJobId) => {
            queryClient.setQueryData<AdminJob[]>(["admin", "jobs"], (prev) =>
                prev?.filter((j) => j.id !== removedJobId)
            );
            queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
        },
    });
}

export function useUpdateJobStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateJobStatus,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "job", variables.jobId] });
        },
    });
}