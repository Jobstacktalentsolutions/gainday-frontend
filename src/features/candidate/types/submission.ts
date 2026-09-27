// Mirrors gainday-backend/src/db/schema/submissions.schema.ts CandidateAnswer exactly —
// the backend only ever stores one free-text field per task, so a task with both an
// objective (multiple-choice) part and an open-ended part must have its answer collapsed
// into a single responseBody string before it's sent. See buildResponseBody in TaskRunner.
export interface CandidateAnswer {
  taskId: string;
  responseBody: string;
  timeSpentSeconds: number;
}
