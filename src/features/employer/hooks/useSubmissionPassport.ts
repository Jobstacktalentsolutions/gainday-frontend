import { useQuery } from "@tanstack/react-query";
import { getMockPassportSummary } from "@/features/capability-passport/mocks/passport";
import type { CapabilityPassportSummary } from "@/features/capability-passport/types/passport";

const MOCK_LATENCY_MS = 600;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO: swap for the real endpoint that returns a submission's candidate passport. It must NOT
// include the candidate-only improvement suggestions.
const fetchSubmissionPassport = async (): Promise<CapabilityPassportSummary> => {
    await wait(MOCK_LATENCY_MS);
    return getMockPassportSummary();
};

// `enabled` lets the page defer the request until the modal is actually opened.
export const useSubmissionPassport = (
    jobId: string | undefined,
    submissionId: string | undefined,
    enabled: boolean,
) => {
    return useQuery({
        queryKey: ["employer", "submission-passport", jobId, submissionId],
        queryFn: fetchSubmissionPassport,
        enabled: enabled && Boolean(jobId && submissionId),
    });
};