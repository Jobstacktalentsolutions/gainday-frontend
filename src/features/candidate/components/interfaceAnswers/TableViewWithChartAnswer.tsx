import type { ReactNode } from "react";
import TaskChart from "@/features/simulation-tasks/charts/TaskChart";
import { InterfaceType, type TableViewWithChartPayload } from "@/features/simulation-tasks/types";
import TableViewResponsePanelAnswer from "./TableViewResponsePanelAnswer";
import type { ClassificationAnswerState } from "./types";

interface Props {
    payload: TableViewWithChartPayload;
    value: string;
    onChange: (value: string) => void;
    objectiveSlot?: ReactNode;
    classification?: ClassificationAnswerState;
    readOnly?: boolean;
}

// The chart comes first, as the overview; the table beneath it carries the exact figures the
// candidate works from, and everything else follows the table answer layout.
const TableViewWithChartAnswer = ({ payload, ...answer }: Props) => (
    <div className="flex w-full flex-col gap-4">
        <TaskChart chart={payload.chart} />
        <TableViewResponsePanelAnswer
            payload={{ interfaceType: InterfaceType.TABLE_VIEW_RESPONSE_PANEL, table: payload.table, placeholder: payload.placeholder }}
            {...answer}
        />
    </div>
);

export default TableViewWithChartAnswer;
