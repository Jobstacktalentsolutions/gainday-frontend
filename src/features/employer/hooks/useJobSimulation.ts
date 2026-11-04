import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { BackendJobWithSimulation } from "../types/job";

const fetchJobWithSimulation = async (jobId: string): Promise<BackendJobWithSimulation> => {
    const { data } = await apiClient.get<BackendJobWithSimulation>(
        `/jobs/${jobId}/with-simulation`,
    );
    return data;
};

// Generation progress is streamed by useGenerationProgress, which invalidates this query once the
// job finishes, so no polling is needed here.
export const useJobSimulation = (jobId: string | null) => {
    return useQuery({
        queryKey: ["employer", "job-simulation", jobId],
        queryFn: () => fetchJobWithSimulation(jobId as string),
        enabled: Boolean(jobId),
    });
};
