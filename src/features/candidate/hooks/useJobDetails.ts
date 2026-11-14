import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toJobBoardListing, type BackendJob } from "../utils/jobAdapter";
import type { JobBoardListing } from "../types/jobBoard";

const fetchJobDetails = async (jobId: string): Promise<JobBoardListing | null> => {
  const { data } = await apiClient.get<BackendJob | null>(`/jobs/${jobId}`);
  return data ? toJobBoardListing(data) : null;
};

export function useJobDetails(jobId: string | undefined) {
  const query = useQuery({
    queryKey: ["candidate", "job-details", jobId],
    queryFn: () => fetchJobDetails(jobId as string),
    enabled: Boolean(jobId),
  });

  return {
    job: query.data ?? undefined,
    isLoading: query.isLoading,
    // A missing job comes back as 200 + null (valid data, not an error), so isError means the
    // request itself failed (network, 5xx). Pages use it to offer "Try again" instead of
    // claiming the job doesn't exist.
    isError: query.isError,
    refetch: query.refetch,
  };
}