import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

interface PublishedJob {
    id: string;
    status: string;
}

export const usePublishJob = () => {
    return useMutation({
        mutationFn: async (jobId: string) => {
            const { data } = await apiClient.put<PublishedJob>(
                `/jobs/${jobId}/publish`,
            );
            return data;
        },
    });
};
