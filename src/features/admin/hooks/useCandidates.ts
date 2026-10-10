import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { createSuspendHook, createUnsuspendHook } from "./suspendFactory";
import type { AdminCandidate } from "../types/user";
import type { PaginatedResponse } from "../types/pagination";
import type { SuspendPayload } from "./suspendFactory";

export interface CandidatesQueryParams {
  search?: string;
  status?: string;
  limit?: number;
}

async function fetchCandidates(
  params: CandidatesQueryParams & { page: number }
): Promise<PaginatedResponse<AdminCandidate>> {
  const { data } = await apiClient.get<PaginatedResponse<AdminCandidate>>("/admin/users", {
    params: {
      role: "JOB_SEEKER",
      search: params.search || undefined,
      status: params.status || undefined,
      page: params.page,
      limit: params.limit || 10,
    },
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

async function unsuspendCandidate(userId: string): Promise<AdminCandidate> {
  const { data } = await apiClient.put<AdminCandidate>(
    `/admin/users/${userId}/status`,
    { isActive: true }
  );
  return {
    ...data,
    status: "active",
    suspensionReason: null,
  };
}

export function useCandidates(params: CandidatesQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: ["admin", "candidates", params.search, params.status, params.limit],
    queryFn: ({ pageParam = 1 }) => fetchCandidates({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
  });
}

export const useSuspendCandidate = createSuspendHook(
  ["admin", "candidates"],
  suspendCandidate
);

export const useUnsuspendCandidate = createUnsuspendHook(
  ["admin", "candidates"],
  unsuspendCandidate
);

