import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  AdminNotification,
  AdminNotificationQueryParams,
  AdminNotificationStats,
} from "../types/notification";
import type { PaginatedResponse } from "../types/pagination";

const NOTIFICATIONS_KEY = ["admin", "notifications"] as const;

async function fetchNotifications(
  params: AdminNotificationQueryParams & { page: number },
): Promise<PaginatedResponse<AdminNotification>> {
  const { data } = await apiClient.get<PaginatedResponse<AdminNotification>>("/admin/notifications", {
    params: {
      severity: params.severity,
      unreadOnly: params.unreadOnly || undefined,
      page: params.page,
      limit: params.limit || 10,
    },
  });
  return data;
}

export function useAdminNotifications(params: AdminNotificationQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: [...NOTIFICATIONS_KEY, "list", params.severity, params.unreadOnly, params.limit],
    queryFn: ({ pageParam = 1 }) => fetchNotifications({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined),
  });
}

export function useAdminNotificationStats() {
  return useQuery({
    queryKey: [...NOTIFICATIONS_KEY, "stats"],
    queryFn: async () => {
      const { data } = await apiClient.get<AdminNotificationStats>("/admin/notifications/stats");
      return data;
    },
    refetchInterval: 30000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.put<AdminNotification>(`/admin/notifications/${id}/read`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.put<{ updated: number }>("/admin/notifications/read-all");
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}
