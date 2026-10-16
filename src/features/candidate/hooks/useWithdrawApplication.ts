import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { apiClient } from "@/lib/api/client";
import { APPLICATIONS_QUERY_KEY } from "./useMyApplications";

// PATCH /submissions/:id/withdraw — permanent. The backend answers 409 when the application can
// no longer be withdrawn (the employer decided in the meantime, or it was already withdrawn).
const withdrawApplication = async (submissionId: string) => {
    await apiClient.patch(`/submissions/${submissionId}/withdraw`);
};

export const useWithdrawApplication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: withdrawApplication,
        onSuccess: () => {
            toast.success("Application withdrawn");
        },
        onError: (error) => {
            if (isAxiosError(error) && error.response?.status === 409) {
                toast.error("This application can no longer be withdrawn");
            } else {
                toast.error("Couldn't withdraw your application. Please try again.");
            }
        },
        // Refetch either way — after a 409 the list is stale, which is exactly why it failed.
        onSettled: () => queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY }),
    });
};
