import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { TableViewResponsePanelPayload } from "@/features/simulation-tasks/types";
import ClassificationAnswer from "../objectiveAnswers/ClassificationAnswer";
import ReadOnlyAnswerText from "./ReadOnlyAnswerText";
import type { ClassificationAnswerState } from "./types";

interface Props {
    payload: TableViewResponsePanelPayload;
    value: string;
    onChange: (value: string) => void;
    objectiveSlot?: ReactNode;
    classification?: ClassificationAnswerState;
    readOnly?: boolean;
}

const TableViewResponsePanelAnswer = ({
    payload,
    value,
    onChange,
    objectiveSlot,
    classification,
    readOnly,
}: Props) => {
    const { columns, rows } = payload.table;

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="w-full overflow-x-auto rounded-xl border border-neutral-200">
                <table className="w-full text-left text-[14px]">
                    <thead className="bg-neutral-50">
                        <tr>
                            {columns.map((column, columnIndex) => (
                                <th
                                    key={column}
                                    className={cn(
                                        "px-3.5 py-2.5 font-medium text-neutral-700 align-bottom",
                                        columnIndex === 0 && "whitespace-nowrap"
                                    )}
                                >
                                    {column}
                                </th>
                            ))}

                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-t border-neutral-200">
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className={cn("px-3.5 py-2.5 text-neutral-950 align-middle", cellIndex === 0 && "whitespace-nowrap font-medium")}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {classification ? (
                <ClassificationAnswer component={classification.component} response={classification.response} onChange={classification.onChange} readOnly={readOnly} />
            ) : objectiveSlot}

            {readOnly ? (
                <ReadOnlyAnswerText value={value} />
            ) : (
                <textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={payload.placeholder ?? "Type your response here..."}
                    className="h-38.25 w-full resize-none rounded-lg border border-neutral-200 px-3.5 py-2.5 text-[16px] text-neutral-700 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] outline-none placeholder:text-neutral-400 focus:border-primary-500"
                />
            )}
        </div>
    );
};

export default TableViewResponsePanelAnswer;
