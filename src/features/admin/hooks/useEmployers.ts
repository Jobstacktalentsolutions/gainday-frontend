import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { createSuspendHook } from "./suspendFactory";
import type { AdminEmployer } from "../types/user";
import type { EmployerEditFormValues } from "../schemas/employerEditSchema";

async function fetchEmployers(): Promise<AdminEmployer[]> {
  const { data } = await apiClient.get<AdminEmployer[]>("/admin/users", {
    params: { role: "EMPLOYER" },
  });
  return data;
}

async function suspendEmployer(userId: string): Promise<AdminEmployer> {
  const { data } = await apiClient.put<AdminEmployer>(
    `/admin/users/${userId}/status`,
    { isActive: false }
  );
  return { ...data, status: "suspended" };
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

export function useEmployers() {
  return useQuery({
    queryKey: ["admin", "employers"],
    queryFn: fetchEmployers,
  });
}

export const useSuspendEmployer = createSuspendHook(
  ["admin", "employers"],
  suspendEmployer
);

export function useUpdateEmployer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      values,
    }: {
      userId: string;
      values: EmployerEditFormValues;
    }) => updateEmployer(userId, values),
    onSuccess: (updatedEmployer) => {
      queryClient.setQueryData<AdminEmployer[]>(
        ["admin", "employers"],
        (prev) =>
          prev?.map((e) =>
            e.id === updatedEmployer.id ? { ...e, ...updatedEmployer } : e
          )
      );
      queryClient.invalidateQueries({ queryKey: ["admin", "employers"] });
    },
  });
}
