import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { createSuspendHook } from "./suspendFactory";
import type { AdminCandidate } from "../types/user";

async function fetchCandidates(): Promise<AdminCandidate[]> {
  const { data } = await apiClient.get<AdminCandidate[]>("/admin/users", {
    params: { role: "JOB_SEEKER" },
  });
  return data;
}

async function suspendCandidate(userId: string): Promise<AdminCandidate> {
  const { data } = await apiClient.put<AdminCandidate>(
    `/admin/users/${userId}/status`,
    { isActive: false }
  );
  return { ...data, status: "suspended" };
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
