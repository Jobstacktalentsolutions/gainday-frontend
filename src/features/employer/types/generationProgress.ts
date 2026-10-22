export type GenerationStage =
    | "extraction"
    | "overgenerate"
    | "rankSelect"
    | "taskGeneration"
    | "critic"
    | "persist"
    | "finalising";

/** Mirrors GenerationProgress in gainday-backend/src/modules/generation/generation-progress.ts. */
export interface GenerationProgress {
    stage: GenerationStage;
    percent: number;
    slot: number;
    totalSlots: number;
}
