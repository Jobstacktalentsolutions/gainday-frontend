import type { JobSalaryRange } from "./jobBoard";

// Mirrors gainday-backend/src/db/schema/submissions.schema.ts SubmissionStatus exactly.
export type ApplicationStatus =
    | "PENDING"
    | "GRADING"
    | "GRADED"
    | "GRADING_FAILED"
    | "DISQUALIFIED"
    | "WITHDRAWN"
    | "SELECTED"
    | "NOT_SELECTED";

// Mirrors SubmissionsService.toCandidateApplication (GET /submissions/mine). Only submitted runs
// are returned, so there is always a submittedAt.
export interface Application {
    id: string;
    jobId: string;
    /** Nullable in the jobs table; a submission can only exist for a published job. */
    jobTitle: string | null;
    companyName: string | null;
    status: ApplicationStatus;
    /** ISO 8601 */
    submittedAt: string;
    /** When the final status (withdrawn / selected / not selected / disqualified) took effect;
     *  null while still being graded or awaiting a decision. ISO 8601 */
    decidedAt: string | null;
    /** Overall score out of 100, or null until grading has finished. */
    rating: number | null;
}

// Mirrors SubmissionsService.findApplicationForCandidate (GET /submissions/mine/:id).
export interface ApplicationDetail extends Application {
    job: {
        description: string | null;
        location: string | null;
        employmentType: string | null;
        isRemoteFriendly: boolean;
        skillLevel: string | null;
        requiredSkills: string[];
        salaryRange: JobSalaryRange | null;
        /** ISO 8601 */
        applicationDeadline: string | null;
    };
}
