import type { SubmissionStatus, SubmissionSummary } from "../types/submission";

/** The name once unlocked, otherwise the anonymous display id. */
export const getCandidateLabel = ({
    candidateName,
    displayId,
}: Pick<SubmissionSummary, "candidateName" | "displayId">): string =>
    candidateName === null ? displayId : candidateName;

// What stands in for the score while there isn't one — PENDING means queued but not picked up
// yet, GRADING is in progress, GRADING_FAILED means every retry was exhausted.
const UNSCORED_LABELS: Partial<Record<SubmissionStatus, string>> = {
    PENDING: "Queued",
    GRADING: "Grading…",
    GRADING_FAILED: "Grading failed",
    DISQUALIFIED: "Disqualified",
};

/** The score, or what stands in for it while there isn't one. */
export const formatOverallScore = ({ overallScore, status }: Pick<SubmissionSummary, "overallScore" | "status">): string => {
    if (overallScore !== null) return `${overallScore}%`;
    return UNSCORED_LABELS[status] ?? "—";
};
