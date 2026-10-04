import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { AdminUserAccount } from "../types/user";

export interface CreateAdminFormValues {
  email: string;
  fullName: string;
  password: string;
  role: "MANAGER" | "MODERATOR";
}

async function fetchAdmins(): Promise<AdminUserAccount[]> {
  const { data } = await apiClient.get<AdminUserAccount[]>("/admin/users", {
    params: { role: "ADMIN" },
  });
  return data;
}

export function useAdmins() {
  return useQuery({
    queryKey: ["admin", "admins"],
    queryFn: fetchAdmins,
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
