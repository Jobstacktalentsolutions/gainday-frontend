import { useQuery } from "@tanstack/react-query";
import { mockCandidates } from "../mocks/candidatesData";
import { createSuspendHook } from "./suspendFactory";
import type { AdminCandidate } from "../types/user";

const SIMULATED_LATENCY_MS = 400;

// Replace with real API call once endpoint exists
async function fetchCandidates(): Promise<AdminCandidate[]> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  return mockCandidates;
}

async function suspendCandidate(userId: string): Promise<AdminCandidate> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  const candidate = mockCandidates.find((c) => c.id === userId);
  if (!candidate) throw new Error("Candidate not found");
  return { ...candidate, status: "suspended" };
}

export function useCandidates() {
  return useQuery({
    queryKey: ["admin", "candidates"],
    queryFn: fetchCandidates,
  });
}

export const useSuspendCandidate = createSuspendHook(
  ["admin", "candidates"],
  suspendCandidate
);
