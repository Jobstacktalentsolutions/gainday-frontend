import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockEmployers } from "../mocks/employersData";

import { createSuspendHook } from "./suspendFactory";
import type { AdminEmployer } from "../types/user";
import type { EmployerEditFormValues } from "../schemas/employerEditSchema";

const SIMULATED_LATENCY_MS = 400;

// Replace with real API call once endpoint exists
async function fetchEmployers(): Promise<AdminEmployer[]> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  return mockEmployers;
}

async function suspendEmployer(userId: string): Promise<AdminEmployer> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  const employer = mockEmployers.find((e) => e.id === userId);
  if (!employer) throw new Error("Employer not found");
  return { ...employer, status: "suspended" };
}

async function updateEmployer(
  userId: string,
  values: EmployerEditFormValues
): Promise<AdminEmployer> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  const employer = mockEmployers.find((e) => e.id === userId);
  if (!employer) throw new Error("Employer not found");

  return {
    ...employer,
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
            e.id === updatedEmployer.id ? updatedEmployer : e
          )
      );
    },
  });
}
