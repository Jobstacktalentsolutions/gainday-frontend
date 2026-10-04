import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { createSuspendHook } from "./suspendFactory";
import type { AdminCandidate } from "../types/user";

import type { SuspendPayload } from "./suspendFactory";

async function fetchCandidates(): Promise<AdminCandidate[]> {
  const { data } = await apiClient.get<AdminCandidate[]>("/admin/users", {
    params: { role: "JOB_SEEKER" },
  });
  return data;
}

async function suspendCandidate(payload: SuspendPayload): Promise<AdminCandidate> {
  const userId = typeof payload === "string" ? payload : payload.id;
  const reason = typeof payload === "string" ? undefined : payload.reason;
  const { data } = await apiClient.put<AdminCandidate>(
    `/admin/users/${userId}/status`,
    { isActive: false, suspensionReason: reason }
  );
  return {
    ...data,
    status: "suspended",
    suspensionReason: reason ?? data.suspensionReason,
  };
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
