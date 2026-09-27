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
    retry: false,
  });

  return { job: query.data ?? undefined, isLoading: query.isLoading };
}
