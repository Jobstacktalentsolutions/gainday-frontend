import TextAreaAnswer from "./TextAreaAnswer";
import TableViewResponsePanelAnswer from "./TableViewResponsePanelAnswer";
import CsvDataPanelAnswer from "./CsvDataPanelAnswer";
import type { InterfaceAnswerProps } from "./types";
import {
    InterfaceType,
    type RichTextComposerPayload,
    type TextAreaPayload,
    type TableViewResponsePanelPayload,
    type CsvDataPanelPayload,
} from "@/features/simulation-tasks/types";

const cast = <T,>(value: Record<string, unknown>) => value as unknown as T;

// Keyed identically to the backend's InterfaceType / INTERFACE_SCHEMAS (interface-type.ts) and
// the employer side's interfaceRenderers/registry.tsx — a new interface type is added to all
// three together, one file each, rather than special-cased inline.
export const INTERFACE_ANSWER_RENDERERS: Record<
    InterfaceType,
    (props: InterfaceAnswerProps) => React.JSX.Element
> = {
    [InterfaceType.TEXT_AREA]: ({ payload, value, onChange, objectiveSlot, readOnly }) => (
        <TextAreaAnswer
            payload={cast<TextAreaPayload>(payload)}
            value={value}
            onChange={onChange}
            objectiveSlot={objectiveSlot}
            readOnly={readOnly}
        />
    ),
    [InterfaceType.RICH_TEXT_COMPOSER]: ({ payload, value, onChange, objectiveSlot, readOnly }) => (
        <TextAreaAnswer
            payload={cast<RichTextComposerPayload>(payload)}
            value={value}
            onChange={onChange}
            objectiveSlot={objectiveSlot}
            readOnly={readOnly}
        />
    ),
    [InterfaceType.TABLE_VIEW_RESPONSE_PANEL]: ({ payload, value, onChange, objectiveSlot, classification, readOnly }) => (
        <TableViewResponsePanelAnswer
            payload={cast<TableViewResponsePanelPayload>(payload)}
            value={value}
            onChange={onChange}
            objectiveSlot={objectiveSlot}
            readOnly={readOnly}
            classification={classification}
        />
    ),
    [InterfaceType.CSV_DATA_PANEL]: ({ payload, value, onChange, objectiveSlot, classification, readOnly }) => (
        <CsvDataPanelAnswer
            payload={cast<CsvDataPanelPayload>(payload)}
            value={value}
            onChange={onChange}
            objectiveSlot={objectiveSlot}
            classification={classification}
            readOnly={readOnly}
        />
    ),
};
