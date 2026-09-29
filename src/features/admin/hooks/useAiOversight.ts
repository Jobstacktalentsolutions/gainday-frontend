import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    mockGeneratedSimulations,
    mockFailedScoringSubmissions,
} from "../mocks/aiOversightData";
import type { GeneratedSimulation, FailedScoringSubmission } from "../types/aiOversight";

const SIMULATED_LATENCY_MS = 400;

// ── Generated Simulations ─────────────────────────────────────────────────────

async function fetchGeneratedSimulations(): Promise<GeneratedSimulation[]> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return mockGeneratedSimulations;
}

async function regenerateSimulation(id: string): Promise<GeneratedSimulation> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const sim = mockGeneratedSimulations.find((s) => s.id === id);
    if (!sim) throw new Error("Simulation not found");
    return { ...sim, generatedAt: new Date().toISOString() };
}

async function overrideSimulation(payload: {
    id: string;
    taskCount: number;
    status: GeneratedSimulation["status"];
}): Promise<GeneratedSimulation> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const sim = mockGeneratedSimulations.find((s) => s.id === payload.id);
    if (!sim) throw new Error("Simulation not found");
    return { ...sim, taskCount: payload.taskCount, status: payload.status };
}

export function useGeneratedSimulations() {
    return useQuery({
        queryKey: ["admin", "ai-oversight", "simulations"],
        queryFn: fetchGeneratedSimulations,
    });
}

export function useRegenerateSimulation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: regenerateSimulation,
        onSuccess: (updated) => {
            queryClient.setQueryData<GeneratedSimulation[]>(
                ["admin", "ai-oversight", "simulations"],
                (prev) => prev?.map((s) => (s.id === updated.id ? updated : s)),
            );
        },
    });
}

export function useOverrideSimulation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: overrideSimulation,
        onSuccess: (updated) => {
            queryClient.setQueryData<GeneratedSimulation[]>(
                ["admin", "ai-oversight", "simulations"],
                (prev) => prev?.map((s) => (s.id === updated.id ? updated : s)),
            );
        },
    });
}

// ── Failed Scoring Submissions ────────────────────────────────────────────────

async function fetchFailedScoringSubmissions(): Promise<FailedScoringSubmission[]> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return mockFailedScoringSubmissions;
}

async function retryScoring(id: string): Promise<FailedScoringSubmission> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const submission = mockFailedScoringSubmissions.find((s) => s.id === id);
    if (!submission) throw new Error("Submission not found");
    return { ...submission, status: "resolved" };
}

export function useFailedScoringSubmissions() {
    return useQuery({
        queryKey: ["admin", "ai-oversight", "failed-scoring"],
        queryFn: fetchFailedScoringSubmissions,
    });
}

export function useRetryScoring() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: retryScoring,
        onSuccess: (updated) => {
            queryClient.setQueryData<FailedScoringSubmission[]>(
                ["admin", "ai-oversight", "failed-scoring"],
                (prev) => prev?.map((s) => (s.id === updated.id ? updated : s)),
            );
        },
    });
}
