// TODO: align with the real applications endpoint once it exists. The backend has no hiring-stage
// model yet (submissions are only PENDING | SCORING | SCORED | DISQUALIFIED), so this enum is the
// contract the mock data (mocks/applications.ts) is written against.

export type ApplicationStatus =
    | "PENDING_REVIEW"
    | "REVIEWED"
    | "INTERVIEW_SCHEDULED"
    | "OFFER_EXTENDED"
    | "NOT_SELECTED"
    | "HIRED"
    | "WITHDRAWN";

export interface Application {
    id: string;
    jobId: string;
    jobTitle: string;
    companyName: string;
    /** ISO 8601 */
    appliedAt: string;
    /** Per-application reference, e.g. "GD-4821". */
    reference: string;
    status: ApplicationStatus;
    /** When the current status took effect (or the event date, e.g. an interview). Null if n/a. */
    statusDate: string | null;
    /** Overall score out of 100, or null while the submission is still being scored. */
    rating: number | null;
}