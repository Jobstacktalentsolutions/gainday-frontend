import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { createSuspendHook } from "./suspendFactory";
import type { AdminEmployer } from "../types/user";
import type { PaginatedResponse } from "../types/pagination";
import type { EmployerEditFormValues } from "../schemas/employerEditSchema";
import type { SuspendPayload } from "./suspendFactory";

export interface EmployersQueryParams {
  search?: string;
  status?: string;
  limit?: number;
}

async function fetchEmployers(
  params: EmployersQueryParams & { page: number }
): Promise<PaginatedResponse<AdminEmployer>> {
  const { data } = await apiClient.get<PaginatedResponse<AdminEmployer>>("/admin/users", {
    params: {
      role: "EMPLOYER",
      search: params.search || undefined,
      status: params.status || undefined,
      page: params.page,
      limit: params.limit || 10,
    },
  });
  return data;
}

async function suspendEmployer(payload: SuspendPayload): Promise<AdminEmployer> {
  const userId = typeof payload === "string" ? payload : payload.id;
  const reason = typeof payload === "string" ? undefined : payload.reason;
  const { data } = await apiClient.put<AdminEmployer>(
    `/admin/users/${userId}/status`,
    { isActive: false, suspensionReason: reason }
  );
  return {
    ...data,
    status: "suspended",
    suspensionReason: reason ?? data.suspensionReason,
  };
}

async function updateEmployer(
  userId: string,
  values: EmployerEditFormValues
): Promise<AdminEmployer> {
  const { data } = await apiClient.put<AdminEmployer>(
    `/admin/users/${userId}/status`,
    { isActive: values.status === "active" }
  );
  return {
    ...data,
    name: values.name,
    status: values.status,
    employerProfile: {
      companyName: values.companyName,
      isVerified: values.isVerified,
      adminNotes: values.adminNotes || undefined,
    },
  };
}

export function useEmployers(params: EmployersQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: ["admin", "employers", params.search, params.status, params.limit],
    queryFn: ({ pageParam = 1 }) => fetchEmployers({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
  });
}

export const useSuspendEmployer = createSuspendHook(
  ["admin", "employers"],
  suspendEmployer
);

export function useUpdateEmployer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, values }: { userId: string; values: EmployerEditFormValues }) =>
      updateEmployer(userId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "employers"] });
    },
  });
}
