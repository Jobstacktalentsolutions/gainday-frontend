import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { apiClient } from "@/lib/api/client";
import type { SubmissionDetail } from "../types/submission";

// GET /submissions/:id. Resolves to null on a 404 (missing, withdrawn or never submitted), so the
// page can show its "not found" state instead of treating it as a failure. Anything else, such
// as a 403 for another employer's job, stays an error.
const fetchSubmission = async (submissionId: string): Promise<SubmissionDetail | null> => {
    try {
        const { data } = await apiClient.get<SubmissionDetail>(`/submissions/${submissionId}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) return null;
        throw error;
    }
};

export const useEmployerSubmission = (jobId: string | undefined, submissionId: string | undefined) => {
    return useQuery({
        queryKey: ["employer", "job-submission", jobId, submissionId],
        queryFn: () => fetchSubmission(submissionId as string),
        enabled: Boolean(jobId && submissionId),
    });
};
