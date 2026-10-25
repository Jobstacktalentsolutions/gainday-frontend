import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { creditBalanceQueryKey } from "./useCreditBalance";
import { purchaseHistoryQueryKey } from "./usePurchaseHistory";
import type { FreePackClaimResult } from "../types/billing";

// Contract (not shipped yet): POST /payments/free-pack { packId } -> { balance }.
// Dormant until the backend sets `freePackAvailable` on /payments/balance, so nothing
// calls this endpoint before it exists.
export const useClaimFreePack = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (packId: string) => {
            const { data } = await apiClient.post<FreePackClaimResult>("/payments/free-pack", { packId });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: creditBalanceQueryKey });
            queryClient.invalidateQueries({ queryKey: purchaseHistoryQueryKey });
        },
    });
};