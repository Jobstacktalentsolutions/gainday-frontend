import { useQuery } from "@tanstack/react-query";
import { getMockJobSubmissions } from "../mocks/submission";
import type { JobSubmissionsData } from "../types/submission";

const MOCK_LATENCY_MS = 600;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO: swap for the real employer job-submissions list endpoint once it exists.
const fetchJobSubmissions = async (_jobId: string): Promise<JobSubmissionsData> => {
    await wait(MOCK_LATENCY_MS);
    return getMockJobSubmissions();
};

export const useJobSubmissions = (jobId: string | undefined) => {
    return useQuery({
        queryKey: ["employer", "job-submissions", jobId],
        queryFn: () => fetchJobSubmissions(jobId as string),
        enabled: Boolean(jobId),
    });
};
