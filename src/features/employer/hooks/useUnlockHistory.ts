import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { MOCK_UNLOCKS, USE_MOCK_BILLING } from "../mocks/billing";
import type { UnlockRecord } from "../types/billing";

export const unlockHistoryQueryKey = ["employer", "unlock-history"] as const;

const fetchUnlocks = async (): Promise<UnlockRecord[]> => {
    let rows: UnlockRecord[];
    if (USE_MOCK_BILLING) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        rows = MOCK_UNLOCKS;
    } else {
        // Contract: returns every candidate this employer has unlocked.
        const { data } = await apiClient.get<UnlockRecord[]>("/payments/unlocks");
        rows = data;
    }
    return [...rows].sort((a, b) => b.unlockedAt.localeCompare(a.unlockedAt));
};

export const useUnlockHistory = () =>
    useQuery({ queryKey: unlockHistoryQueryKey, queryFn: fetchUnlocks });