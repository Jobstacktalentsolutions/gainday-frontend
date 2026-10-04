import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export function useAppliedJobIds() {
  const { user, isAuthenticated } = useCurrentUser();
  const isCandidate = isAuthenticated && user?.role === "JOB_SEEKER";

  const query = useQuery({
    queryKey: ["candidate", "applied-job-ids"],
    queryFn: async () => {
      const { data } = await apiClient.get<string[]>("/submissions/applied-job-ids");
      return data;
    },
    enabled: isCandidate,
  });

  const appliedJobIds = query.data ?? [];
  const appliedSet = new Set(appliedJobIds);

  return {
    appliedJobIds,
    appliedSet,
    isLoading: query.isLoading,
  };
}
