import NumericInputEditor from "./objective/NumericInputEditor";
import ClassificationEditor from "./objective/ClassificationEditor";
import ProceduralSequencingEditor from "./objective/ProceduralSequencingEditor";
import SingleBestActionEditor from "./objective/SingleBestActionEditor";
import MultiSelectUnderConstraintEditor from "./objective/MultiSelectUnderConstraintEditor";
import WrittenJustificationEditor from "./openEnded/WrittenJustificationEditor";
import DraftedCommunicationEditor from "./openEnded/DraftedCommunicationEditor";
import InterpretationAnalysisEditor from "./openEnded/InterpretationAnalysisEditor";
import StakeholderPushbackResponseEditor from "./openEnded/StakeholderPushbackResponseEditor";
import type {
    ClassificationComponent,
    DraftedCommunicationComponent,
    InterpretationAnalysisComponent,
    MultiSelectUnderConstraintComponent,
    NumericInputComponent,
    ObjectiveComponentType,
    OpenEndedComponentType,
    ProceduralSequencingComponent,
    SingleBestActionComponent,
    StakeholderPushbackResponseComponent,
    WrittenJustificationComponent,
} from "../types";

interface EditorProps {
    value: Record<string, unknown>;
    onChange: (value: Record<string, unknown>) => void;
}

const cast = <T,>(value: Record<string, unknown>) => value as unknown as T;
const castChange =
    <T,>(onChange: (value: Record<string, unknown>) => void) =>
    (value: T) =>
        onChange(value as unknown as Record<string, unknown>);

// Keyed identically to the backend's ObjectiveComponentType/OpenEndedComponentType unions and
// OBJECTIVE_COMPONENT_SCHEMAS/OPEN_ENDED_COMPONENT_SCHEMAS maps — extend both sides together.
export const OBJECTIVE_COMPONENT_EDITORS: Record<
    ObjectiveComponentType,
    (props: EditorProps) => React.JSX.Element
> = {
    NUMERIC_INPUT: ({ value, onChange }) => (
        <NumericInputEditor
            value={cast<NumericInputComponent>(value)}
            onChange={castChange<NumericInputComponent>(onChange)}
        />
    ),
    CLASSIFICATION: ({ value, onChange }) => (
        <ClassificationEditor
            value={cast<ClassificationComponent>(value)}
            onChange={castChange<ClassificationComponent>(onChange)}
        />
    ),
    PROCEDURAL_SEQUENCING: ({ value, onChange }) => (
        <ProceduralSequencingEditor
            value={cast<ProceduralSequencingComponent>(value)}
            onChange={castChange<ProceduralSequencingComponent>(onChange)}
        />
    ),
    SINGLE_BEST_ACTION: ({ value, onChange }) => (
        <SingleBestActionEditor
            value={cast<SingleBestActionComponent>(value)}
            onChange={castChange<SingleBestActionComponent>(onChange)}
        />
    ),
    MULTI_SELECT_UNDER_CONSTRAINT: ({ value, onChange }) => (
        <MultiSelectUnderConstraintEditor
            value={cast<MultiSelectUnderConstraintComponent>(value)}
            onChange={castChange<MultiSelectUnderConstraintComponent>(onChange)}
        />
    ),
};

export const OPEN_ENDED_COMPONENT_EDITORS: Record<
    OpenEndedComponentType,
    (props: EditorProps) => React.JSX.Element
> = {
    WRITTEN_JUSTIFICATION: ({ value, onChange }) => (
        <WrittenJustificationEditor
            value={cast<WrittenJustificationComponent>(value)}
            onChange={castChange<WrittenJustificationComponent>(onChange)}
        />
    ),
    DRAFTED_COMMUNICATION: ({ value, onChange }) => (
        <DraftedCommunicationEditor
            value={cast<DraftedCommunicationComponent>(value)}
            onChange={castChange<DraftedCommunicationComponent>(onChange)}
        />
    ),
    INTERPRETATION_ANALYSIS: ({ value, onChange }) => (
        <InterpretationAnalysisEditor
            value={cast<InterpretationAnalysisComponent>(value)}
            onChange={castChange<InterpretationAnalysisComponent>(onChange)}
        />
    ),
    STAKEHOLDER_PUSHBACK_RESPONSE: ({ value, onChange }) => (
        <StakeholderPushbackResponseEditor
            value={cast<StakeholderPushbackResponseComponent>(value)}
            onChange={castChange<StakeholderPushbackResponseComponent>(onChange)}
        />
    ),
};
