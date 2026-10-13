import type { InterfaceType } from "@/features/simulation-tasks/types";

// Mirrors gainday-backend/src/modules/generation/roles/role-module.interface.ts exactly.
export type ObjectiveComponentType =
    | "NUMERIC_INPUT"
    | "CLASSIFICATION"
    | "PROCEDURAL_SEQUENCING"
    | "SINGLE_BEST_ACTION"
    | "MULTI_SELECT_UNDER_CONSTRAINT";

// Each shape below is the backend's real objectiveComponent shape (component-schemas.ts) MINUS
// its answer-key field — see gainday-backend/src/modules/simulations/candidate-task.util.ts,
// the one place that strips it before a task ever reaches this candidate-facing type. Never add
// a `correct*` field to any of these — the candidate client must never receive one.
export interface SingleBestActionCandidateComponent {
    componentType: "SINGLE_BEST_ACTION";
    options: string[];
}

export interface MultiSelectUnderConstraintCandidateComponent {
    componentType: "MULTI_SELECT_UNDER_CONSTRAINT";
    options: string[];
    selectCount: number;
}

export interface NumericInputCandidateComponent {
    componentType: "NUMERIC_INPUT";
    unit: string | null;
}

export interface ClassificationCandidateComponent {
    componentType: "CLASSIFICATION";
    items: string[];
    buckets: string[];
}

export interface ProceduralSequencingCandidateComponent {
    componentType: "PROCEDURAL_SEQUENCING";
    steps: string[];
}

export type CandidateObjectiveComponent =
    | SingleBestActionCandidateComponent
    | MultiSelectUnderConstraintCandidateComponent
    | NumericInputCandidateComponent
    | ClassificationCandidateComponent
    | ProceduralSequencingCandidateComponent;

// The shape GET /simulations/job/:jobId actually returns — SimulationTask (simulation-tasks/
// types.ts) with objectiveComponent replaced by its sanitized, componentType-tagged form.
export interface CandidateSimulationTask {
    id: string;
    questionBankId: string | null;
    taskType: string;
    category: string;
    title: string;
    scenarioDescription: string;
    questionPrompt: string;
    objectiveComponent: CandidateObjectiveComponent | null;
    openEndedComponent?: Record<string, unknown>;
    businessProblemDerived: boolean;
    interfaceType: InterfaceType;
    interfacePayload: Record<string, unknown>;
}
