import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { AdminJob } from "../types/job";
import type { PaginatedResponse } from "../types/pagination";

export interface AdminJobsQueryParams {
  search?: string;
  status?: string;
  limit?: number;
}

async function fetchAdminJobs(
  params: AdminJobsQueryParams & { page: number }
): Promise<PaginatedResponse<AdminJob>> {
  const { data } = await apiClient.get<PaginatedResponse<AdminJob>>("/admin/jobs", {
    params: {
      search: params.search || undefined,
      status: params.status || undefined,
      page: params.page,
      limit: params.limit || 10,
    },
  });
  return data;
}

async function removeJobPost(jobId: string): Promise<string> {
  await apiClient.delete(`/admin/jobs/${jobId}`);
  return jobId;
}

async function updateJobStatus(payload: { jobId: string; status: string }): Promise<void> {
  await apiClient.put(`/admin/jobs/${payload.jobId}/status`, { status: payload.status });
}

export function useAdminJobs(params: AdminJobsQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: ["admin", "jobs", params.search, params.status, params.limit],
    queryFn: ({ pageParam = 1 }) => fetchAdminJobs({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
  });
}

export function useRemoveJobPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeJobPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
    },
  });
}

export function useUpdateJobStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateJobStatus,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "job", variables.jobId] });
    },
  });
}