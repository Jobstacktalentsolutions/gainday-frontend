import RichTextComposerView from "./RichTextComposerView";
import TextAreaView from "./TextAreaView";
import TableViewResponsePanelView from "./TableViewResponsePanelView";
import CsvDataPanelView from "./CsvDataPanelView";
import TableViewWithChartView from "./TableViewWithChartView";
import CaseFileTextAreaView from "./CaseFileTextAreaView";
import {
    InterfaceType,
    type InterfacePayload,
    type RichTextComposerPayload,
    type TextAreaPayload,
    type TableViewResponsePanelPayload,
    type CsvDataPanelPayload,
    type TableViewWithChartPayload,
    type CaseFileTextAreaPayload,
} from "../types";

interface InterfaceRendererProps {
    payload: Record<string, unknown>;
    mode: "preview" | "edit";
    onChange?: (payload: Record<string, unknown>) => void;
}

// Keyed identically to the backend's InterfaceType enum / INTERFACE_SCHEMAS map — adding a new
// interface type means adding an entry here AND on the backend, kept deliberately in lockstep.
const INTERFACE_RENDERERS: Record<
    InterfaceType,
    (props: InterfaceRendererProps) => React.JSX.Element
> = {
    [InterfaceType.RICH_TEXT_COMPOSER]: ({ payload, mode, onChange }) => (
        <RichTextComposerView
            payload={payload as unknown as RichTextComposerPayload}
            mode={mode}
            onChange={onChange as unknown as (p: RichTextComposerPayload) => void}
        />
    ),
    [InterfaceType.TEXT_AREA]: ({ payload, mode, onChange }) => (
        <TextAreaView
            payload={payload as unknown as TextAreaPayload}
            mode={mode}
            onChange={onChange as unknown as (p: TextAreaPayload) => void}
        />
    ),
    [InterfaceType.TABLE_VIEW_RESPONSE_PANEL]: ({ payload, mode, onChange }) => (
        <TableViewResponsePanelView
            payload={payload as unknown as TableViewResponsePanelPayload}
            mode={mode}
            onChange={onChange as unknown as (p: TableViewResponsePanelPayload) => void}
        />
    ),
    [InterfaceType.CSV_DATA_PANEL]: ({ payload, mode, onChange }) => (
        <CsvDataPanelView
            payload={payload as unknown as CsvDataPanelPayload}
            mode={mode}
            onChange={onChange as unknown as (p: CsvDataPanelPayload) => void}
        />
    ),
    [InterfaceType.TABLE_VIEW_WITH_CHART]: ({ payload, mode, onChange }) => (
        <TableViewWithChartView
            payload={payload as unknown as TableViewWithChartPayload}
            mode={mode}
            onChange={onChange as unknown as (p: TableViewWithChartPayload) => void}
        />
    ),
    // Employers see a staged chat as the candidate does at the start: its case file. The script is
    // server-only and is never shown here.
    [InterfaceType.STAGED_CHAT]: ({ payload, mode }) => (
        <CaseFileTextAreaView payload={payload as unknown as CaseFileTextAreaPayload} mode={mode} />
    ),
    [InterfaceType.CASE_FILE_TEXT_AREA]: ({ payload, mode }) => (
        <CaseFileTextAreaView payload={payload as unknown as CaseFileTextAreaPayload} mode={mode} />
    ),
};

interface InterfaceRendererViewProps {
    interfaceType: InterfaceType;
    payload: Record<string, unknown>;
    mode?: "preview" | "edit";
    onChange?: (payload: InterfacePayload) => void;
}

export const InterfaceRendererView = ({
    interfaceType,
    payload,
    mode = "preview",
    onChange,
}: InterfaceRendererViewProps) => {
    const Renderer = INTERFACE_RENDERERS[interfaceType];
    if (!Renderer) {
        return (
            <div className="rounded-md border border-dashed border-error-300 bg-error-50 p-3 text-sm text-error-600">
                Unknown interface type: {interfaceType}
            </div>
        );
    }
    return (
        <Renderer
            payload={payload}
            mode={mode}
            onChange={onChange as unknown as (p: Record<string, unknown>) => void}
        />
    );
};
