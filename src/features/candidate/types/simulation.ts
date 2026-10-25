import type { InterfaceType, PriorityRankingItem } from "@/features/simulation-tasks/types";

// Mirrors gainday-backend/src/modules/generation/roles/role-module.interface.ts exactly.
export type ObjectiveComponentType =
    | "NUMERIC_INPUT"
    | "CLASSIFICATION"
    | "PROCEDURAL_SEQUENCING"
    | "SINGLE_BEST_ACTION"
    | "MULTI_SELECT_UNDER_CONSTRAINT"
    | "PRIORITY_RANKING"
    | "RECONCILIATION"
    | "JOURNAL_ENTRY"
    | "NUMERIC_TABLE";

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

export interface PriorityRankingCandidateComponent {
    componentType: "PRIORITY_RANKING";
    items: PriorityRankingItem[];
}

// Finance components as the candidate sees them: the answer key and tolerances are stripped
// server-side (backend simulations/candidate-task.util.ts).
export interface ReconciliationCandidateComponent {
    componentType: "RECONCILIATION";
    items: string[];
    sideOptions: { value: string; label: string }[];
    unit: string | null;
}

export interface JournalEntryCandidateComponent {
    componentType: "JOURNAL_ENTRY";
    accounts: string[];
    references: string[];
    unit: string | null;
}

export interface NumericTableCandidateComponent {
    componentType: "NUMERIC_TABLE";
    rowLabels: string[];
    columnLabels: string[];
}

export type CandidateObjectiveComponent =
    | SingleBestActionCandidateComponent
    | MultiSelectUnderConstraintCandidateComponent
    | NumericInputCandidateComponent
    | ClassificationCandidateComponent
    | ProceduralSequencingCandidateComponent
    | PriorityRankingCandidateComponent
    | ReconciliationCandidateComponent
    | JournalEntryCandidateComponent
    | NumericTableCandidateComponent;

// What a candidate submits for each finance component (backend component-schemas.ts). `null`
// means the part was left untouched. `sides` is index-aligned with the component's `items`.
export interface ReconciliationResponse {
    sides: (string | null)[];
    adjustedBalance: number | null;
}

export interface JournalEntryLine {
    reference: string;
    account: string | null;
    side: "DEBIT" | "CREDIT" | null;
    amount: number | null;
}

export interface JournalEntryResponse {
    lines: JournalEntryLine[];
}

export interface NumericTableResponse {
    values: (number | null)[][];
}

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
