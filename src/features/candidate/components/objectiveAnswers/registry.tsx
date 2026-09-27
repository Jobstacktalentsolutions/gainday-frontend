import SingleBestActionAnswer, { describeSingleBestAction } from "./SingleBestActionAnswer";
import MultiSelectUnderConstraintAnswer, {
    describeMultiSelectUnderConstraint,
} from "./MultiSelectUnderConstraintAnswer";
import NumericInputAnswer, { describeNumericInput } from "./NumericInputAnswer";
import ClassificationAnswer, { describeClassification } from "./ClassificationAnswer";
import ProceduralSequencingAnswer, { describeProceduralSequencing } from "./ProceduralSequencingAnswer";
import type { CandidateObjectiveComponent, ObjectiveComponentType } from "../../types/simulation";

export interface ObjectiveAnswerProps {
    component: CandidateObjectiveComponent;
    response: unknown;
    onChange: (response: unknown) => void;
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
    CLASSIFICATION: ({ component, response, onChange }) => (
        <ClassificationAnswer
            component={cast(component)}
            response={cast(response)}
            onChange={castOnChange<Record<string, string>>(onChange)}
        />
    ),
    PROCEDURAL_SEQUENCING: ({ component, response, onChange }) => (
        <ProceduralSequencingAnswer
            component={cast(component)}
            response={cast(response)}
            onChange={castOnChange<number[]>(onChange)}
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
};
