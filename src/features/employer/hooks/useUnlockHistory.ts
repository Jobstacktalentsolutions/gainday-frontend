import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { UnlockRecord } from "../types/billing";

export const unlockHistoryQueryKey = ["employer", "unlock-history"] as const;

export const useUnlockHistory = () =>
    useQuery({
        queryKey: unlockHistoryQueryKey,
        queryFn: async () => (await apiClient.get<UnlockRecord[]>("/payments/unlocks")).data,
    });
