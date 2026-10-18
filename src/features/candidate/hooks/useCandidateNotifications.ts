import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { CandidateNotification } from "../types/notification";

const NOTIFICATIONS_KEY = ["candidate", "notifications"] as const;
const UNREAD_STATUS_KEY = [...NOTIFICATIONS_KEY, "unread-status"] as const;
const UNREAD_POLL_MS = 60_000;

// GET /candidate/notifications/unread-status — cheap check the header runs on load to decide
// whether the bell shows its dot.
export const useHasUnreadNotifications = () => {
    return useQuery({
        queryKey: UNREAD_STATUS_KEY,
        queryFn: async () => {
            const { data } = await apiClient.get<{ hasUnread: boolean }>("/candidate/notifications/unread-status");
            return data.hasUnread;
        },
        refetchInterval: UNREAD_POLL_MS,
    });
};

// Only fetched once the bell is opened.
export const useCandidateNotifications = (enabled: boolean) => {
    return useQuery({
        queryKey: [...NOTIFICATIONS_KEY, "list"],
        queryFn: async () => {
            const { data } = await apiClient.get<CandidateNotification[]>("/candidate/notifications");
            return data;
        },
        enabled,
    });
};

export const useMarkNotificationRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await apiClient.put<CandidateNotification>(`/candidate/notifications/${id}/read`);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
    });
};

export const useMarkAllNotificationsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const { data } = await apiClient.put<{ updated: number }>("/candidate/notifications/read-all");
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
    });
};
