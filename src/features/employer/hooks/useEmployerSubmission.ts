import { useQuery } from "@tanstack/react-query";
import { getMockSubmissionDetail } from "../mocks/submission";
import type { SubmissionDetail } from "../types/submission";

const MOCK_LATENCY_MS = 600;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO: swap for the real employer submission-detail endpoint (including per-task scores and
// evidence). Resolves to null when the submission doesn't exist, so the page can show its
// "not found" state instead of treating it as an error.
const fetchSubmission = async (jobId: string, submissionId: string): Promise<SubmissionDetail | null> => {
    await wait(MOCK_LATENCY_MS);
    return getMockSubmissionDetail(jobId, submissionId);
};

export const useEmployerSubmission = (jobId: string | undefined, submissionId: string | undefined) => {
    return useQuery({
        queryKey: ["employer", "job-submission", jobId, submissionId],
        queryFn: () => fetchSubmission(jobId as string, submissionId as string),
        enabled: Boolean(jobId && submissionId),
    });
};