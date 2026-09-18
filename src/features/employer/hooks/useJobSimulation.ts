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

// Polls while generation is in flight (job.status === "GENERATING") so SimulationBuilder knows
// when the real generated tasks are ready, replacing the old fake setTimeout delay entirely.
export const useJobSimulation = (jobId: string | null) => {
    return useQuery({
        queryKey: ["employer", "job-simulation", jobId],
        queryFn: () => fetchJobWithSimulation(jobId as string),
        enabled: Boolean(jobId),
        refetchInterval: (query) =>
            query.state.data?.status === "GENERATING" ? 2000 : false,
    });
};
