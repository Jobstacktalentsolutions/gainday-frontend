import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

interface TaskReviewStatus {
    pendingCount: number;
}

// Task slots that went wrong during generation and are waiting on an admin. The employer is emailed
// when they are resolved, so no polling is needed.
export const useTaskReviewStatus = (jobId: string | null) => {
    return useQuery({
        queryKey: ["employer", "task-review-status", jobId],
        queryFn: async () => {
            const { data } = await apiClient.get<TaskReviewStatus>(`/jobs/${jobId}/task-review`);
            return data;
        },
        enabled: Boolean(jobId),
    });
};
