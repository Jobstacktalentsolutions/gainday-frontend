import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { creditBalanceQueryKey } from "./useCreditBalance";
import type { UnlockResult } from "../types/payments";

// On a 402 the backend's error body (PaymentRequiredBody) comes back as error.response.data —
// callers read it straight off the thrown axios error rather than through a parsed error type,
// since class membership (isAxiosError) is already how the rest of the app distinguishes these.
export const useUnlockCandidates = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (submissionIds: string[]) => {
            const { data } = await apiClient.post<UnlockResult>("/payments/unlock", {
                submissionIds,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: creditBalanceQueryKey });
        },
    });
};
