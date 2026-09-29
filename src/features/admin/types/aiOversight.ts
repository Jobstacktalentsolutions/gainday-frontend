export type SimulationStatus = "live" | "draft" | "archived";

export type ScoringFailureStatus = "failed" | "retrying" | "resolved";

export interface GeneratedSimulation {
    id: string;
    jobTitle: string;
    taskCount: number;
    status: SimulationStatus;
    generatedAt: string;
    jobId: string;
}

export interface FailedScoringSubmission {
    id: string;
    candidateId: string;
    candidateNumber: string;
    jobTitle: string;
    failureReason: string;
    failedTaskIndex: number;
    status: ScoringFailureStatus;
    occurredAt: string;
}
