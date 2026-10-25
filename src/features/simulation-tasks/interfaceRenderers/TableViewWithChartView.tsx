import TaskChart from "../charts/TaskChart";
import TableViewResponsePanelView from "./TableViewResponsePanelView";
import { InterfaceType, type TableViewWithChartPayload } from "../types";

interface Props {
    payload: TableViewWithChartPayload;
    mode: "preview" | "edit";
    onChange?: (payload: TableViewWithChartPayload) => void;
}

// A table with its chart. The chart is derived from the table's figures, so only the table's
// wording is editable here; the server rejects a change to the figures themselves.
const TableViewWithChartView = ({ payload, mode, onChange }: Props) => (
    <div className="flex flex-col gap-4">
        <TaskChart chart={payload.chart} />
        <TableViewResponsePanelView
            payload={{ interfaceType: InterfaceType.TABLE_VIEW_RESPONSE_PANEL, table: payload.table, placeholder: payload.placeholder }}
            mode={mode}
            onChange={(next) => onChange?.({ ...payload, table: next.table, placeholder: next.placeholder })}
        />
    </div>
);

export default TableViewWithChartView;
