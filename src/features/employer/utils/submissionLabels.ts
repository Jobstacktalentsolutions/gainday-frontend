import type { SubmissionSummary } from "../types/submission";

/** The name once unlocked, otherwise the anonymous display id. */
export const getCandidateLabel = ({
    candidateName,
    displayId,
}: Pick<SubmissionSummary, "candidateName" | "displayId">): string =>
    candidateName === null ? displayId : candidateName;

/** The score, or what stands in for it while there isn't one. */
export const formatOverallScore = ({ overallScore, status }: Pick<SubmissionSummary, "overallScore" | "status">): string => {
    if (overallScore !== null) return `${overallScore}%`;
    return status === "DISQUALIFIED" ? "Disqualified" : "Grading\u2026";
};
