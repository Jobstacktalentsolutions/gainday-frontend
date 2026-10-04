import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { CandidateDetailResponse } from "../types/candidateDetail";

async function fetchCandidateDetail(userId: string): Promise<CandidateDetailResponse> {
  const { data } = await apiClient.get<CandidateDetailResponse>(`/admin/candidates/${userId}`);
  return data;
}

export function useCandidateDetail(userId?: string) {
  return useQuery({
    queryKey: ["admin", "candidate", userId],
    queryFn: () => fetchCandidateDetail(userId!),
    enabled: Boolean(userId),
  });
}
