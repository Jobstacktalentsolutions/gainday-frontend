import TextAreaAnswer from "./TextAreaAnswer";
import TableViewResponsePanelAnswer from "./TableViewResponsePanelAnswer";
import {
    InterfaceType,
    type RichTextComposerPayload,
    type TextAreaPayload,
    type TableViewResponsePanelPayload,
} from "@/features/simulation-tasks/types";

export interface InterfaceAnswerProps {
    payload: Record<string, unknown>;
    value: string;
    onChange: (value: string) => void;
}

const cast = <T,>(value: Record<string, unknown>) => value as unknown as T;

// Keyed identically to the backend's InterfaceType / INTERFACE_SCHEMAS (interface-type.ts) and
// the employer side's interfaceRenderers/registry.tsx — a new interface type is added to all
// three together, one file each, rather than special-cased inline.
export const INTERFACE_ANSWER_RENDERERS: Record<
    InterfaceType,
    (props: InterfaceAnswerProps) => React.JSX.Element
> = {
    [InterfaceType.TEXT_AREA]: ({ payload, value, onChange }) => (
        <TextAreaAnswer payload={cast<TextAreaPayload>(payload)} value={value} onChange={onChange} />
    ),
    [InterfaceType.RICH_TEXT_COMPOSER]: ({ payload, value, onChange }) => (
        <TextAreaAnswer payload={cast<RichTextComposerPayload>(payload)} value={value} onChange={onChange} />
    ),
    [InterfaceType.TABLE_VIEW_RESPONSE_PANEL]: ({ payload, value, onChange }) => (
        <TableViewResponsePanelAnswer
            payload={cast<TableViewResponsePanelPayload>(payload)}
            value={value}
            onChange={onChange}
        />
    ),
};
