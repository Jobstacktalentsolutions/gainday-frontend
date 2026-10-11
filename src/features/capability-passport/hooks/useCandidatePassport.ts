import { useQuery } from "@tanstack/react-query";
import { getMockCandidatePassport } from "../mocks/passport";
import type { CandidatePassport } from "../types/passport";

const MOCK_LATENCY_MS = 600;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO: swap for the real passport endpoint. Resolves to null when the candidate has no scored
// simulations yet, so the page can show its empty state instead of treating it as an error.
const fetchCandidatePassport = async (): Promise<CandidatePassport | null> => {
    await wait(MOCK_LATENCY_MS);
    return getMockCandidatePassport();
};

export const useCandidatePassport = () => {
    return useQuery({
        queryKey: ["candidate", "passport"],
        queryFn: fetchCandidatePassport,
    });
};