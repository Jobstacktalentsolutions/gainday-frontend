import type {
    IntegrityStatus,
    SortDirection,
    SubmissionSort,
    SubmissionSortKey,
    SubmissionSummary,
} from "../types/submission";

// Landing order: strongest candidates first.
export const DEFAULT_SORT: SubmissionSort = { key: "capabilityScore", direction: "desc" };

// Lower = cleaner. PENDING sits between clean and flagged because it hasn't been assessed yet.
const INTEGRITY_RANK: Record<IntegrityStatus, number> = {
    CLEAN: 0,
    PENDING: 1,
    MINOR_FLAGS: 2,
    REVIEW_NEEDED: 3,
};

export interface SortConfig {
    key: SubmissionSortKey;
    label: string;
    options: { direction: SortDirection; label: string }[];
}

export const SORT_CONFIG: SortConfig[] = [
    {
        key: "submittedAt",
        label: "Submission Date",
        options: [
            { direction: "desc", label: "Newest first" },
            { direction: "asc", label: "Oldest first" },
        ],
    },
    {
        key: "capabilityScore",
        label: "Capability Score",
        options: [
            { direction: "desc", label: "Highest first" },
            { direction: "asc", label: "Lowest first" },
        ],
    },
    {
        key: "integrity",
        label: "Integrity",
        options: [
            { direction: "asc", label: "Cleanest first" },
            { direction: "desc", label: "Most flagged first" },
        ],
    },
];

const sortValue = (submission: SubmissionSummary, key: SubmissionSortKey): number => {
    switch (key) {
        case "submittedAt":
            return new Date(submission.submittedAt).getTime();
        case "capabilityScore":
            return submission.capabilityScore;
        case "integrity":
            return INTEGRITY_RANK[submission.integrityStatus];
    }
};

export const sortSubmissions = (submissions: SubmissionSummary[], sort: SubmissionSort): SubmissionSummary[] => {
    const modifier = sort.direction === "asc" ? 1 : -1;
    return [...submissions].sort((a, b) => {
        const difference = sortValue(a, sort.key) - sortValue(b, sort.key);
        if (difference !== 0) return difference * modifier;
        // Ties fall back to overall score (best first) so the order is stable and meaningful.
        return b.overallScore - a.overallScore || a.candidateName.localeCompare(b.candidateName);
    });
};