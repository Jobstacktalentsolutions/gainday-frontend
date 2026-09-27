import type { TableViewResponsePanelPayload } from "@/features/simulation-tasks/types";

interface Props {
    payload: TableViewResponsePanelPayload;
    value: string;
    onChange: (value: string) => void;
}

const MAX_CHARS = 1000;

// The table is reference data the candidate reasons from (e.g. a ledger to reconcile), not
// itself editable — their answer is the free-text response below it.
const TableViewResponsePanelAnswer = ({ payload, value, onChange }: Props) => (
    <div className="flex w-full flex-col gap-4">
        <div className="w-full overflow-x-auto rounded-xl border border-neutral-200">
            <table className="w-full text-left text-[14px]">
                <thead className="bg-neutral-50">
                    <tr>
                        {payload.table.columns.map((column) => (
                            <th key={column} className="whitespace-nowrap px-4 py-2.5 font-medium text-neutral-700">
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {payload.table.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t border-neutral-200">
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="whitespace-nowrap px-4 py-2.5 text-neutral-950">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <textarea
            value={value}
            onChange={(event) => onChange(event.target.value.slice(0, MAX_CHARS))}
            placeholder={payload.placeholder ?? "Type your response here..."}
            className="h-38.25 w-full resize-none rounded-lg border border-neutral-200 px-3.5 py-2.5 text-[16px] text-neutral-700 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] outline-none placeholder:text-neutral-400 focus:border-primary-500"
        />
    </div>
);

export default TableViewResponsePanelAnswer;
