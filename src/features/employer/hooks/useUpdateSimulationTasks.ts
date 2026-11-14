import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { SimulationTask } from "@/features/simulation-tasks/types";

interface UpdateSimulationTasksParams {
    simulationId: string;
    tasks: SimulationTask[];
}

export const useUpdateSimulationTasks = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ simulationId, tasks }: UpdateSimulationTasksParams) => {
            const { data } = await apiClient.put(`/simulations/${simulationId}`, {
                tasks,
            });
            return data;
        },
        onSuccess: () =>
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["employer", "job-simulation"] }),
                queryClient.invalidateQueries({ queryKey: ["employer", "job-preview"] }),
            ]),
    });
};
