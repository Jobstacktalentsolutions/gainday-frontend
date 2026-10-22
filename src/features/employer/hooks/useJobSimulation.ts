import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { JobStatus } from "../types/job";
import type { SimulationTask } from "@/features/simulation-tasks/types";

interface JobWithSimulation {
    id: string;
    status: JobStatus;
    simulation: {
        id: string;
        tasks: SimulationTask[];
        timeLimitMinutes: number;
    } | null;
}

const fetchJobWithSimulation = async (jobId: string): Promise<JobWithSimulation> => {
    const { data } = await apiClient.get<JobWithSimulation>(
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
