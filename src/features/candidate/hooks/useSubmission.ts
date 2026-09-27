import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { CandidateAnswer } from "../types/submission";

// POST /submissions/job/:jobId/start — requires a signed-in JOB_SEEKER (see
// SubmissionsController). Creates one Submission row per call, so the caller must guard
// against firing this more than once per run (TaskRunner does this with a ref).
async function startSubmission(jobId: string, simulationId: string) {
  const { data } = await apiClient.post<{ id: string }>(`/submissions/job/${jobId}/start`, {
    simulationId,
  });
  return data;
}

export function useStartSubmission() {
  return useMutation({
    mutationFn: ({ jobId, simulationId }: { jobId: string; simulationId: string }) =>
      startSubmission(jobId, simulationId),
  });
}

// PUT /submissions/:id/submit — locks in the final answers and queues grading. antiCheatFlags
// is whatever useSimulationIntegrityStore collected client-side (tab-hidden/window-blur) — the
// backend adds its own server-observed stale-heartbeat flag on top of these, not instead.
async function submitAnswers(submissionId: string, answers: CandidateAnswer[], antiCheatFlags: string[]) {
  const { data } = await apiClient.put(`/submissions/${submissionId}/submit`, { answers, antiCheatFlags });
  return data;
}

export function useSubmitSimulation() {
  return useMutation({
    mutationFn: ({
      submissionId,
      answers,
      antiCheatFlags = [],
    }: {
      submissionId: string;
      answers: CandidateAnswer[];
      antiCheatFlags?: string[];
    }) => submitAnswers(submissionId, answers, antiCheatFlags),
  });
}

// POST /submissions/:id/heartbeat itself is called directly from useConnectionMonitor's
// interval (not through a mutation hook here) — it fires on a timer rather than in response to
// a user action, and needs to read wasLostRef synchronously inside the same interval tick.
