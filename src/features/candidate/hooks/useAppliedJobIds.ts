import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { APPLICATIONS_QUERY_KEY, fetchMyApplications } from "./useMyApplications";
import type { Application } from "../types/application";

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

  const applicationsQuery = useQuery({
    queryKey: APPLICATIONS_QUERY_KEY,
    queryFn: fetchMyApplications,
    enabled: isCandidate,
  });

  const appliedJobIds = query.data ?? [];
  const appliedSet = new Set(appliedJobIds);

  const applications = applicationsQuery.data ?? [];
  const applicationByJobId = useMemo(() => {
    const map = new Map<string, Application>();
    for (const app of applications) {
      map.set(app.jobId, app);
    }
    return map;
  }, [applications]);

  const getSubmissionUrlForJob = (jobId: string): string => {
    const app = applicationByJobId.get(jobId);
    if (!app) return "/candidate/applications";
    if (app.rating !== null) {
      return `/candidate/submissions/${app.id}/result`;
    }
    return `/candidate/applications/${app.id}`;
  };

  return {
    appliedJobIds,
    appliedSet,
    applications,
    applicationByJobId,
    getSubmissionUrlForJob,
    isLoading: query.isLoading,
  };
}
