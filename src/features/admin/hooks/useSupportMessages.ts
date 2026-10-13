import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  SupportMessage,
  SupportMessageStats,
  SupportQueryParams,
  ReplySupportMessagePayload,
} from "../types/support";
import type { PaginatedResponse } from "../types/pagination";

async function fetchSupportMessages(
  params: SupportQueryParams & { page: number }
): Promise<PaginatedResponse<SupportMessage>> {
  const { data } = await apiClient.get<PaginatedResponse<SupportMessage>>(
    "/admin/support/messages",
    {
      params: {
        search: params.search || undefined,
        status: params.status && params.status !== "all" ? params.status : undefined,
        page: params.page,
        limit: params.limit || 10,
      },
    }
  );
  return data;
}

export function useSupportMessages(params: SupportQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: ["admin", "support", "messages", params.search, params.status, params.limit],
    queryFn: ({ pageParam = 1 }) =>
      fetchSupportMessages({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
  });
}

export function useSupportStats() {
  return useQuery({
    queryKey: ["admin", "support", "stats"],
    queryFn: async () => {
      const { data } = await apiClient.get<SupportMessageStats>(
        "/admin/support/messages/stats"
      );
      return data;
    },
    refetchInterval: 30000,
  });
}

export function useUpdateSupportStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await apiClient.put<SupportMessage>(
        `/admin/support/messages/${id}/status`,
        { status }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "support"] });
    },
  });
}

export function useReplySupportMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: ReplySupportMessagePayload;
    }) => {
      const { data } = await apiClient.post<{
        success: boolean;
        message: string;
        supportMessage: SupportMessage;
      }>(`/admin/support/messages/${id}/reply`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "support"] });
    },
  });
}
