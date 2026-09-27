import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { CandidateSimulationTask } from "../types/simulation";
import type { JobBoardListing } from "../types/jobBoard";

// tasks are CandidateSimulationTask, not the shared SimulationTask — GET /simulations/job/:jobId
// sanitizes each task's objectiveComponent (strips its answer-key field, tags it with
// componentType) before it ever reaches a candidate. See gainday-backend's
// candidate-task.util.ts and this feature's types/simulation.ts.
export interface JobSimulation {
  id: string;
  jobId: string;
  tasks: CandidateSimulationTask[];
  timeLimitMinutes: number;
}

// By the time a candidate reaches this page the job is ACTIVE, so its simulation is already
// persisted and final — no GENERATING/polling state here (unlike the employer's useJobSimulation).
async function fetchJobSimulation(jobId: string): Promise<JobSimulation | null> {
  const { data } = await apiClient.get<JobSimulation | null>(`/simulations/job/${jobId}`);
  return data;
}

export function useJobSimulation(job: JobBoardListing | undefined) {
  return useQuery({
    queryKey: ["candidate", "job-simulation", job?.id],
    queryFn: () => fetchJobSimulation(job!.id),
    enabled: Boolean(job),
  })
}
