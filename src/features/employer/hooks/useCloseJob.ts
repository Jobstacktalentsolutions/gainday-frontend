import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { apiClient } from "@/lib/api/client";

// PATCH /jobs/:id/close - the owner closing their own live job. The backend answers 409 when the
// job isn't live (already closed, or never published).
export const useCloseJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (jobId: string) => {
            await apiClient.patch(`/jobs/${jobId}/close`);
        },
        onSuccess: () => {
            toast.success("Job closed");
        },
        onError: (error) => {
            if (isAxiosError(error) && error.response?.status === 409) {
                toast.error("Only live jobs can be closed");
            } else {
                toast.error("Couldn't close this job. Please try again.");
            }
        },
        // Refetch either way: after a 409 the page is showing a stale status.
        onSettled: (_data, _error, jobId) => {
            queryClient.invalidateQueries({ queryKey: ["employer", "jobs"] });
            queryClient.invalidateQueries({ queryKey: ["employer", "job-preview", jobId] });
        },
    });
};
