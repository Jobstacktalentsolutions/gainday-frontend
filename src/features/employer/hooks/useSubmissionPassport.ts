import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { CapabilityPassportSummary } from "@/features/capability-passport/types/passport";

// GET /submissions/:submissionId/passport. Null for a submission whose candidate account was deleted (nothing to
// aggregate) or a candidate with no graded simulations yet — never includes the candidate-only
// improvement suggestions.
const fetchSubmissionPassport = async (
    submissionId: string,
): Promise<CapabilityPassportSummary | null> => {
    const { data } = await apiClient.get<CapabilityPassportSummary | null>(
        `/submissions/${submissionId}/passport`,
    );
    return data;
};

// `enabled` lets the page defer the request until the modal is actually opened.
export const useSubmissionPassport = (submissionId: string | undefined, enabled: boolean) => {
    return useQuery({
        queryKey: ["employer", "submission-passport", submissionId],
        queryFn: () => fetchSubmissionPassport(submissionId as string),
        enabled: enabled && Boolean(submissionId),
    });
};