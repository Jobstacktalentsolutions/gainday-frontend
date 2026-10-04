import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { createSuspendHook } from "./suspendFactory";
import type { AdminAccount } from "../types/user";

async function fetchAdmins(): Promise<AdminAccount[]> {
  const { data } = await apiClient.get<AdminAccount[]>("/admin/users", {
    params: { role: "ADMIN" },
  });
  return data;
}

async function suspendAdmin(userId: string): Promise<AdminAccount> {
  const { data } = await apiClient.put<AdminAccount>(
    `/admin/users/${userId}/status`,
    { isActive: false }
  );
  return { ...data, status: "suspended" };
}

export function useAdmins() {
  return useQuery({
    queryKey: ["admin", "admins"],
    queryFn: fetchAdmins,
  });
}

export const useSuspendAdmin = createSuspendHook(
  ["admin", "admins"],
  suspendAdmin
);
