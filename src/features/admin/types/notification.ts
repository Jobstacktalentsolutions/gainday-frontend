// Mirrors gainday-backend/src/db/schema/admin-notifications.schema.ts.
export type NotificationSeverity = "INFO" | "WARNING" | "CRITICAL";

export interface AdminNotification {
  id: string;
  severity: NotificationSeverity;
  /** Machine-readable kind, e.g. "GRADING_FAILED". */
  type: string;
  title: string;
  message: string;
  /** The failure reason, when there is one. */
  details: string | null;
  /** Ids of what this is about, e.g. { jobId, submissionId }. */
  metadata: Record<string, string> | null;
  /** ISO 8601; null while unread. */
  readAt: string | null;
  createdAt: string;
}

export interface AdminNotificationStats {
  total: number;
  unread: number;
  criticalUnread: number;
}

export interface AdminNotificationQueryParams {
  severity?: NotificationSeverity;
  unreadOnly?: boolean;
  limit?: number;
}
