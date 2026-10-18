import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { CandidatePassport } from "../types/passport";

// GET /capability-passport/me. Resolves to null when the candidate has no graded simulations
// yet, so the page can show its empty state instead of treating it as an error.
const fetchCandidatePassport = async (): Promise<CandidatePassport | null> => {
    const { data } = await apiClient.get<CandidatePassport | null>("/capability-passport/me");
    return data;
};

export const useCandidatePassport = () => {
    return useQuery({
        queryKey: ["candidate", "passport"],
        queryFn: fetchCandidatePassport,
    });
};