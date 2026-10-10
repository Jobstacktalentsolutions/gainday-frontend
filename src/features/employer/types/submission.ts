// TODO: align with the real employer submissions endpoints once they exist. Until then these
// shapes are the contract the mock data (mocks/submissions.ts) is written against — anything
// added here has to be added to the backend response too.

export type IntegrityStatus = "CLEAN" | "MINOR_FLAGS" | "PENDING" | "REVIEW_NEEDED";

// Mirrors the four keys of the backend's CategoryScores (see CURRENT_SCHEMA.md). Each category
// only carries its score here — rationale/evidence aren't shown on these pages.
export type CategoryKey =
    | "problemSolving"
    | "judgmentExecution"
    | "writtenCommunication"
    | "commercialDomainAwareness";

export type CategoryScores = Record<CategoryKey, number>;

// One row of the "All Submissions" table.
export interface SubmissionSummary {
    id: string;
    candidateName: string;
    /** Human-friendly candidate reference, e.g. "GD-4809". */
    displayId: string;
    overallScore: number;
    categoryScores: CategoryScores;
    capabilityScore: number;
    /** Change in capability score since the candidate's previous attempt. */
    capabilityDelta: number;
    attemptCount: number;
    timeTakenSeconds: number;
    /** ISO 8601 */
    submittedAt: string;
    integrityStatus: IntegrityStatus;
}

export interface JobSubmissionsData {
    jobTitle: string;
    submissions: SubmissionSummary[];
}

export interface TaskResult {
    taskId: string;
    taskNumber: number;
    title: string;
    /** 0–100 */
    score: number;
    evidence: string;
}

export interface SubmissionContact {
    email: string;
    phone: string;
}

export interface SubmissionDetail {
    id: string;
    jobId: string;
    candidateName: string;
    displayId: string;
    overallScore: number;
    /** ISO 8601 */
    submittedAt: string;
    integrityStatus: IntegrityStatus;
    tasks: TaskResult[];
    /** Only populated once the employer has unlocked this candidate — null while locked. */
    contact: SubmissionContact | null;
    isUnlocked: boolean;
    /** Capability scores per attempt, oldest first. The last entry is the current score. */
    capabilityHistory: number[];
    /** Proctoring signals that were monitored during the run. */
    integrityChecks: string[];
}

export type SubmissionSortKey = "submittedAt" | "capabilityScore" | "integrity";
export type SortDirection = "asc" | "desc";

export interface SubmissionSort {
    key: SubmissionSortKey;
    direction: SortDirection;
}