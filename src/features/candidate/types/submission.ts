// Mirrors gainday-backend/src/db/schema/submissions.schema.ts CandidateAnswer exactly. A task's
// structured (objective) answer and its written answer are sent as they were given, and also
// flattened into responseBody — the plain text the grader reads. See buildResponseBody in
// TaskRunner. Review pages render from the structured fields, never from responseBody.
export interface CandidateAnswer {
  taskId: string;
  responseBody: string;
  /** Shape depends on the task's objective component type; null when it has none or was untouched. */
  objectiveResponse: unknown;
  textResponse: string;
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
