import type { CategoryKey, CategoryScores } from "@/features/capability-passport/types/passport";

export type IntegrityStatus = "CLEAN" | "MINOR_FLAGS" | "PENDING" | "REVIEW_NEEDED";

// The category types live with the shared capability-passport module; re-exported so existing
// imports from this file keep working.
export type { CategoryKey, CategoryScores };

// Mirrors gainday-backend/src/db/schema/submissions.schema.ts SubmissionStatus. Employers never
// receive WITHDRAWN rows, and only submitted runs are returned.
export type SubmissionStatus =
    | "PENDING"
    | "GRADING"
    | "GRADED"
    | "GRADING_FAILED"
    | "DISQUALIFIED"
    | "SELECTED"
    | "NOT_SELECTED";

// Mirrors SubmissionsService.toEmployerListItem (GET /submissions/job/:jobId), one row of the
// "All Submissions" table.
export interface SubmissionSummary {
    id: string;
    /** "GD-" plus the first six characters of the submission id. */
    displayId: string;
    status: SubmissionStatus;
    /** Null until the employer has unlocked this candidate. */
    candidateName: string | null;
    isUnlocked: boolean;
    /** ISO 8601 */
    submittedAt: string;
    timeTakenSeconds: number | null;
    /** 0-100, whole number. Null until graded. */
    overallScore: number | null;
    /** Each 0-100, whole numbers. Null until graded. */
    categoryScores: CategoryScores | null;
    /** Average across the candidate's graded applications in this job's domain, out of 1000.
     *  Null until this application is graded, and for guest submissions. */
    capabilityScore: number | null;
    /** The capability score after each application in the domain up to this one, oldest first;
     *  the last entry is `capabilityScore`. */
    capabilityHistory: number[];
    integrityStatus: IntegrityStatus;
}

export interface TaskResult {
    taskId: string;
    taskNumber: number;
    title: string;
    /** Markdown. */
    questionPrompt: string;
    /** The candidate's answer as plain text; null when they left it blank. */
    answer: string | null;
    /** 0-100. Null when this task has not been graded. */
    score: number | null;
    weight?: number;
    /** The grader's summary of the answer. Null when this task has not been graded. */
    evidence: string | null;
}

export interface SubmissionContact {
    email: string;
    phone: string | null;
}

// One kind of proctoring event and how often it was recorded. `type` is an open string on the
// backend (see AntiCheatEvent); labels live in utils/submissionIntegrity.ts.
export interface IntegrityEventSummary {
    type: string;
    count: number;
}

// Mirrors SubmissionsService.findByIdForEmployer (GET /submissions/:id).
export interface SubmissionDetail extends SubmissionSummary {
    jobId: string;
    /** Every task in the simulation's order, graded or not. */
    tasks: TaskResult[];
    integrityEvents: IntegrityEventSummary[];
    /** Only populated once the employer has unlocked this candidate. */
    contact: SubmissionContact | null;
}

export type SubmissionSortKey = "submittedAt" | "capabilityScore" | "integrity";
export type SortDirection = "asc" | "desc";

export interface SubmissionSort {
    key: SubmissionSortKey;
    direction: SortDirection;
}
