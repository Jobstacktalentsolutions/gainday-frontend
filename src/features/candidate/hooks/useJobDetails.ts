import { useMemo } from "react";
import { MOCK_JOBS } from "../mocks/mockJobs";

export function useJobDetails(jobId: string | undefined) {
  const job = useMemo(() => MOCK_JOBS.find((item) => item.id === jobId), [jobId]);
  return { job, isLoading: false };
}