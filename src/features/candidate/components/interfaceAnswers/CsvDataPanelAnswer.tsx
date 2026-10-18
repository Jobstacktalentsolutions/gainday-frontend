import type { ReactNode } from "react";
import { Download } from "lucide-react";
import { csvToTable, downloadCsv } from "@/features/simulation-tasks/csv";
import type { CsvDataPanelPayload, TableViewResponsePanelPayload } from "@/features/simulation-tasks/types";
import { InterfaceType } from "@/features/simulation-tasks/types";
import TableViewResponsePanelAnswer from "./TableViewResponsePanelAnswer";
import type { ClassificationAnswerState } from "./types";

interface Props {
    payload: CsvDataPanelPayload;
    value: string;
    onChange: (value: string) => void;
    objectiveSlot?: ReactNode;
    classification?: ClassificationAnswerState;
    readOnly?: boolean;
}

// The data arrives as CSV but is read as a table, exactly like a table task: the CSV is parsed and
// handed to the same table-and-answer layout (so a classification still takes its bucket on each
// row), with a download for opening the data in a spreadsheet.
const CsvDataPanelAnswer = ({ payload, ...rest }: Props) => {
    const tablePayload: TableViewResponsePanelPayload = {
        interfaceType: InterfaceType.TABLE_VIEW_RESPONSE_PANEL,
        table: csvToTable(payload.csv),
        placeholder: payload.placeholder,
    };

    return (
        <div className="flex w-full flex-col gap-2">
            <button
                type="button"
                onClick={() => downloadCsv(payload.csv)}
                className="flex w-fit cursor-pointer items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
                <Download className="size-4" /> Download data as CSV
            </button>
            <TableViewResponsePanelAnswer payload={tablePayload} {...rest} />
        </div>
    );
};

export default CsvDataPanelAnswer;
