import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { CreditPack } from "../types/payments";

// Fixed by the client's pricing spec and barely ever changes, so it's fine to cache for the
// lifetime of the session rather than refetch on every modal open.
const PACKS_STALE_TIME_MS = 10 * 60 * 1000;

const fetchPacks = async (): Promise<CreditPack[]> => {
    const { data } = await apiClient.get<CreditPack[]>("/payments/packs");
    return data;
};

export const useCreditPacks = () => {
    return useQuery({
        queryKey: ["employer", "credit-packs"],
        queryFn: fetchPacks,
        staleTime: PACKS_STALE_TIME_MS,
    });
};
