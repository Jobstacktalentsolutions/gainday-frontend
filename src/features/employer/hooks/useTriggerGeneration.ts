import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export const useTriggerGeneration = () => {
    return useMutation({
        mutationFn: async (jobId: string) => {
            const { data } = await apiClient.post<{ status: string; jobId: string }>(
                `/simulations/job/${jobId}/generate`,
            );
            return data;
        },
    });
};
