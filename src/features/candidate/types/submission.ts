// Mirrors gainday-backend/src/db/schema/submissions.schema.ts CandidateAnswer exactly —
// the backend only ever stores one free-text field per task, so a task with both an
// objective (multiple-choice) part and an open-ended part must have its answer collapsed
// into a single responseBody string before it's sent. See buildResponseBody in TaskRunner.
export interface CandidateAnswer {
  taskId: string;
  responseBody: string;
  timeSpentSeconds: number;
}

// Mirrors gainday-backend/src/db/schema/submissions.schema.ts AntiCheatEvent exactly — one
// proctoring signal, tied to when and which task it happened during. Built by
// useSimulationIntegrityStore.ts, sent as-is (no client-side summarizing) in the
// PUT /submissions/:id/submit body's antiCheatFlags field.
export interface AntiCheatEvent {
  type: string;
  /** Which task was active when this was recorded — null when there isn't a meaningful one. */
  taskId: string | null;
  /** ISO 8601 — when the event was *recorded*. For "idle", that's when the spell was closed
   *  out (by activity, or by the end-of-run flush), not when the idle period started. */
  occurredAt: string;
  /** Only present for "idle" — the spell's real measured length, not a fixed-size tick. */
  durationMs?: number;
}
