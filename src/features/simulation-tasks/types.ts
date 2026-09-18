// Mirrors the backend contract exactly (gainday-backend/src/modules/generation/roles/*,
// gainday-backend/src/db/schema/simulations.schema.ts). Keep these two in lockstep — a new
// InterfaceType or component type must be added on both sides at once.

export const InterfaceType = {
  RICH_TEXT_COMPOSER: "RICH_TEXT_COMPOSER",
  TEXT_AREA: "TEXT_AREA",
  TABLE_VIEW_RESPONSE_PANEL: "TABLE_VIEW_RESPONSE_PANEL",
} as const;
export type InterfaceType = (typeof InterfaceType)[keyof typeof InterfaceType];

export interface RichTextComposerPayload {
  interfaceType: typeof InterfaceType.RICH_TEXT_COMPOSER;
  placeholder: string | null;
}

export interface TextAreaPayload {
  interfaceType: typeof InterfaceType.TEXT_AREA;
  placeholder: string | null;
}

export interface TableViewResponsePanelPayload {
  interfaceType: typeof InterfaceType.TABLE_VIEW_RESPONSE_PANEL;
  table: { columns: string[]; rows: string[][] };
  placeholder: string | null;
}

export type InterfacePayload =
  | RichTextComposerPayload
  | TextAreaPayload
  | TableViewResponsePanelPayload;

export type ObjectiveComponentType =
  | "NUMERIC_INPUT"
  | "CLASSIFICATION"
  | "PROCEDURAL_SEQUENCING"
  | "SINGLE_BEST_ACTION"
  | "MULTI_SELECT_UNDER_CONSTRAINT";

export type OpenEndedComponentType =
  | "WRITTEN_JUSTIFICATION"
  | "DRAFTED_COMMUNICATION"
  | "INTERPRETATION_ANALYSIS"
  | "STAKEHOLDER_PUSHBACK_RESPONSE";

export interface NumericInputComponent {
  correctValue: number;
  tolerance: number;
  unit: string | null;
}

export interface ClassificationComponent {
  items: string[];
  buckets: string[];
  correctMapping: { item: string; bucket: string }[];
}

export interface ProceduralSequencingComponent {
  steps: string[];
  correctOrder: number[];
}

export interface SingleBestActionComponent {
  options: string[];
  correctOptionIndex: number;
}

export interface MultiSelectUnderConstraintComponent {
  options: string[];
  selectCount: number;
  correctOptionIndices: number[];
}

export type ObjectiveComponent =
  | NumericInputComponent
  | ClassificationComponent
  | ProceduralSequencingComponent
  | SingleBestActionComponent
  | MultiSelectUnderConstraintComponent;

export interface WrittenJustificationComponent {
  decisionAlreadyMade: string;
}

export interface DraftedCommunicationComponent {
  recipient: string;
  goal: string;
}

export interface InterpretationAnalysisComponent {
  dataToInterpret: string;
}

export interface StakeholderPushbackResponseComponent {
  pushbackStatement: string;
}

export type OpenEndedComponent =
  | WrittenJustificationComponent
  | DraftedCommunicationComponent
  | InterpretationAnalysisComponent
  | StakeholderPushbackResponseComponent;

/** Markdown string — render via react-markdown without rehype-raw (never interpret raw HTML). */
export type MarkdownString = string;

export interface SimulationTask {
  id: string;
  /** The question_bank row this task was persisted as — null for a task added/regenerated
   *  but not yet accepted + persisted (see gainday-backend SimulationsService.updateSimulationTasks).
   *  Such a task has no anchors and cannot be graded yet. */
  questionBankId: string | null;
  taskType: string;
  category: string;
  title: string;
  scenarioDescription: MarkdownString;
  questionPrompt: MarkdownString;
  objectiveComponent?: Record<string, unknown>;
  openEndedComponent?: Record<string, unknown>;
  businessProblemDerived: boolean;
  interfaceType: InterfaceType;
  interfacePayload: Record<string, unknown>;
}
