import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

interface PublishedJob {
    id: string;
    status: string;
}

export const usePublishJob = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (jobId: string) => {
            const { data } = await apiClient.put<PublishedJob>(`/jobs/${jobId}/publish`);
            return data;
        },
        onSuccess: (_data, jobId) =>
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["employer", "jobs"] }),
                queryClient.invalidateQueries({ queryKey: ["employer", "job-preview", jobId] }),
            ]),
    });
};
