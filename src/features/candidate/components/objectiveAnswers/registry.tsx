import SingleBestActionAnswer from "./SingleBestActionAnswer";
import MultiSelectUnderConstraintAnswer from "./MultiSelectUnderConstraintAnswer";
import NumericInputAnswer from "./NumericInputAnswer";
import ClassificationAnswer from "./ClassificationAnswer";
import ProceduralSequencingAnswer from "./ProceduralSequencingAnswer";
import PriorityRankingAnswer from "./PriorityRankingAnswer";
import ReconciliationAnswer from "./ReconciliationAnswer";
import JournalEntryAnswer from "./JournalEntryAnswer";
import NumericTableAnswer from "./NumericTableAnswer";
import {
    describeSingleBestAction,
    describeMultiSelectUnderConstraint,
    describeNumericInput,
    describeClassification,
    describeProceduralSequencing,
    describePriorityRanking,
    describeReconciliation,
    describeJournalEntry,
    describeNumericTable,
} from "./describeAnswers";
import type {
    CandidateObjectiveComponent,
    JournalEntryCandidateComponent,
    JournalEntryResponse,
    NumericTableCandidateComponent,
    NumericTableResponse,
    ObjectiveComponentType,
    ReconciliationCandidateComponent,
    ReconciliationResponse,
} from "../../types/simulation";

export interface ObjectiveAnswerProps {
    component: CandidateObjectiveComponent;
    response: unknown;
    onChange: (response: unknown) => void;
    /** Show a submitted answer instead of collecting one (employer and admin review pages). */
    readOnly?: boolean;
}

const cast = <T,>(value: unknown) => value as T;
const castOnChange =
    <T,>(onChange: (response: unknown) => void) =>
    (response: T) =>
        onChange(response);

// Keyed identically to the backend's ObjectiveComponentType (see gainday-backend's
// role-module.interface.ts and candidate-task.util.ts, which tags every objectiveComponent
// with this same componentType) — mirrors the employer-side componentEditors/registry.tsx
// pattern so a new component type is added to both registries together as the task
// interface evolves, rather than hardcoded into one page.
export const OBJECTIVE_ANSWER_RENDERERS: Record<
    ObjectiveComponentType,
    (props: ObjectiveAnswerProps) => React.JSX.Element
> = {
    SINGLE_BEST_ACTION: ({ component, response, onChange }) => (
        <SingleBestActionAnswer
            component={cast(component)}
            response={cast(response)}
            onChange={castOnChange<number>(onChange)}
        />
    ),
    MULTI_SELECT_UNDER_CONSTRAINT: ({ component, response, onChange }) => (
        <MultiSelectUnderConstraintAnswer
            component={cast(component)}
            response={cast(response)}
            onChange={castOnChange<number[]>(onChange)}
        />
    ),
    NUMERIC_INPUT: ({ component, response, onChange }) => (
        <NumericInputAnswer
            component={cast(component)}
            response={cast(response)}
            onChange={castOnChange<number | null>(onChange)}
        />
    ),
    CLASSIFICATION: ({ component, response, onChange, readOnly }) => (
        <ClassificationAnswer
            readOnly={readOnly}
            component={cast(component)}
            response={cast(response)}
            onChange={castOnChange<Record<string, string>>(onChange)}
        />
    ),
    PROCEDURAL_SEQUENCING: ({ component, response, onChange, readOnly }) => (
        <ProceduralSequencingAnswer
            readOnly={readOnly}
            component={cast(component)}
            response={cast(response)}
            onChange={castOnChange<number[]>(onChange)}
        />
    ),
    PRIORITY_RANKING: ({ component, response, onChange, readOnly }) => (
        <PriorityRankingAnswer
            readOnly={readOnly}
            component={cast(component)}
            response={cast(response)}
            onChange={castOnChange<number[]>(onChange)}
        />
    ),
    RECONCILIATION: ({ component, response, onChange }) => (
        <ReconciliationAnswer
            component={cast<ReconciliationCandidateComponent>(component)}
            response={cast<ReconciliationResponse | null>(response)}
            onChange={castOnChange<ReconciliationResponse>(onChange)}
        />
    ),
    JOURNAL_ENTRY: ({ component, response, onChange }) => (
        <JournalEntryAnswer
            component={cast<JournalEntryCandidateComponent>(component)}
            response={cast<JournalEntryResponse | null>(response)}
            onChange={castOnChange<JournalEntryResponse>(onChange)}
        />
    ),
    NUMERIC_TABLE: ({ component, response, onChange }) => (
        <NumericTableAnswer
            component={cast<NumericTableCandidateComponent>(component)}
            response={cast<NumericTableResponse | null>(response)}
            onChange={castOnChange<NumericTableResponse>(onChange)}
        />
    ),
};

// Renders the candidate's response as plain text for CandidateAnswer.responseBody (the one
// free-text field the backend stores per task — see gainday-backend submissions.schema.ts).
// Returns "" when the candidate never touched this task's objective part.
export const OBJECTIVE_ANSWER_DESCRIBERS: Record<
    ObjectiveComponentType,
    (component: CandidateObjectiveComponent, response: unknown) => string
> = {
    SINGLE_BEST_ACTION: (c, r) => describeSingleBestAction(cast(c), cast(r)),
    MULTI_SELECT_UNDER_CONSTRAINT: (c, r) => describeMultiSelectUnderConstraint(cast(c), cast(r)),
    NUMERIC_INPUT: (c, r) => describeNumericInput(cast(c), cast(r)),
    CLASSIFICATION: (c, r) => describeClassification(cast(c), cast(r)),
    PROCEDURAL_SEQUENCING: (c, r) => describeProceduralSequencing(cast(c), cast(r)),
    PRIORITY_RANKING: (c, r) => describePriorityRanking(cast(c), cast(r)),
    RECONCILIATION: (c, r) => describeReconciliation(cast<ReconciliationCandidateComponent>(c), cast<ReconciliationResponse | null>(r)),
    JOURNAL_ENTRY: (c, r) => describeJournalEntry(cast<JournalEntryCandidateComponent>(c), cast<JournalEntryResponse | null>(r)),
    NUMERIC_TABLE: (c, r) => describeNumericTable(cast<NumericTableCandidateComponent>(c), cast<NumericTableResponse | null>(r)),
};
