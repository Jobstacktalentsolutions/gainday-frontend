import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

interface SelectCandidateParams {
    submissionId: string;
    selected: boolean;
    jobId?: string;
}

export const useSelectCandidate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ submissionId, selected }: SelectCandidateParams) => {
            const { data } = await apiClient.patch<{ id: string; status: string; isSelected: boolean }>(
                `/submissions/${submissionId}/select`,
                { selected },
            );
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["employer", "job-submissions"] });
            if (variables.jobId) {
                queryClient.invalidateQueries({
                    queryKey: ["employer", "job-submission", variables.jobId, variables.submissionId],
                });
            }
        },
    });
};
