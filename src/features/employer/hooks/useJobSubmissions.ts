import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { SubmissionSummary } from "../types/submission";

// GET /submissions/job/:jobId - submitted, non-withdrawn applications for one of the employer's
// jobs. useJobSubmissionsCount shares this endpoint and only needs the array length.
const fetchJobSubmissions = async (jobId: string): Promise<SubmissionSummary[]> => {
    const { data } = await apiClient.get<SubmissionSummary[]>(`/submissions/job/${jobId}`);
    return data;
};

export const useJobSubmissions = (jobId: string | undefined) => {
    return useQuery({
        queryKey: ["employer", "job-submissions", jobId],
        queryFn: () => fetchJobSubmissions(jobId as string),
        enabled: Boolean(jobId),
    });
};
