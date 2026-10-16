import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { CreatePurchaseResult } from "../types/payments";

export const usePurchasePack = () => {
    return useMutation({
        mutationFn: async (packId: string) => {
            const { data } = await apiClient.post<CreatePurchaseResult>("/payments/purchases", {
                packId,
            });
            return data;
        },
    });
};
