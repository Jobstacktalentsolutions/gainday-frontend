// Mirrors gainday-backend/src/db/schema/candidate-notifications.schema.ts.
export type CandidateNotificationType = "SELECTED";

export interface CandidateNotification {
    id: string;
    type: CandidateNotificationType;
    title: string;
    message: string;
    /** Ids of what the notification is about. */
    metadata: { submissionId: string; jobId: string } | null;
    /** ISO 8601; null while unread. */
    readAt: string | null;
    /** ISO 8601 */
    createdAt: string;
}
