import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { CreditBalance } from "../types/payments";

export const creditBalanceQueryKey = ["employer", "credit-balance"] as const;

const fetchBalance = async (): Promise<CreditBalance> => {
    const { data } = await apiClient.get<CreditBalance>("/payments/balance");
    return data;
};

export const useCreditBalance = () => {
    return useQuery({
        queryKey: creditBalanceQueryKey,
        queryFn: fetchBalance,
    });
};
