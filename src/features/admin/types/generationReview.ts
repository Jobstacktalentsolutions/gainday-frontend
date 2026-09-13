import type { SimulationTask } from "@/features/simulation-tasks/types";

export type GenerationReviewStatus = "PENDING" | "APPROVED_WITH_EDITS" | "REJECTED";

// Mirrors gainday-backend QuestionBankTaskContent — same as SimulationTask minus id/category
// (category lives as a sibling column on the review item instead).
export type QuestionBankTaskContent = Omit<SimulationTask, "id" | "category">;

export interface FailedGenerationAttempt {
    attemptNumber: number;
    candidateId: string;
    taskDraft: QuestionBankTaskContent;
    anchors: unknown[] | null;
    criticFailureReasons: string[];
}

export interface GenerationReviewItem {
    id: string;
    jobId: string;
    slotIndex: number;
    category: string;
    attempts: FailedGenerationAttempt[];
    status: GenerationReviewStatus;
    resolvedTaskContent: QuestionBankTaskContent | null;
    reviewedByAdminId: string | null;
    reviewedAt: string | null;
    createdAt: string;
    updatedAt: string;
    job: { id: string; title: string | null } | null;
}
