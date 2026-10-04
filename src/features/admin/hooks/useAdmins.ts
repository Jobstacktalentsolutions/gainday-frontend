import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { AdminUserAccount } from "../types/user";
import type { PaginatedResponse } from "../types/pagination";

export interface CreateAdminFormValues {
  email: string;
  fullName: string;
  password: string;
  role: "MANAGER" | "MODERATOR";
}

export interface AdminsQueryParams {
  search?: string;
  status?: string;
  limit?: number;
}

async function fetchAdmins(
  params: AdminsQueryParams & { page: number }
): Promise<PaginatedResponse<AdminUserAccount>> {
  const { data } = await apiClient.get<PaginatedResponse<AdminUserAccount>>("/admin/users", {
    params: {
      role: "ADMIN",
      search: params.search || undefined,
      status: params.status || undefined,
      page: params.page,
      limit: params.limit || 10,
    },
  });
  return data;
}

export function useAdmins(params: AdminsQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: ["admin", "admins", params.search, params.status, params.limit],
    queryFn: ({ pageParam = 1 }) => fetchAdmins({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: CreateAdminFormValues) => {
      const { data } = await apiClient.post<AdminUserAccount>("/admin/admins", values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await apiClient.delete(`/admin/admins/${userId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });
}

export function useToggleAdminStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const { data } = await apiClient.put(`/admin/users/${userId}/status`, { isActive });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    },
  });
}
