import type { ReactNode } from "react";
import type { TableViewResponsePanelPayload } from "@/features/simulation-tasks/types";
import BucketSelect from "../objectiveAnswers/BucketSelect";
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

const MAX_CHARS = 1000;

// The table is the material the candidate reasons from (a ledger to reconcile, a lead list to
// prioritise), so it comes first. A classification is answered on the table itself — one bucket
// picker per row, matched to its item by the row's first cell — rather than in a separate list
// of bare names. Any other structured answer sits between the table and the written response.
const TableViewResponsePanelAnswer = ({
    payload,
    value,
    onChange,
    objectiveSlot,
    classification,
    readOnly,
}: Props) => {
    const { columns, rows } = payload.table;
    const rowLabels = rows.map((row) => row[0]?.trim() ?? "");

    const matchedItem = (rowIndex: number) =>
        classification?.component.items.find((item) => item.trim() === rowLabels[rowIndex]);

    const hasInlineBuckets = rows.some((_, rowIndex) => matchedItem(rowIndex) !== undefined);
    // Items that no row names still need a way to be answered.
    const unmatchedItems =
        classification?.component.items.filter((item) => !rowLabels.includes(item.trim())) ?? [];
    const mapping = classification?.response ?? {};

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="w-full overflow-x-auto rounded-xl border border-neutral-200">
                <table className="w-full text-left text-[14px]">
                    <thead className="bg-neutral-50">
                        <tr>
                            {columns.map((column) => (
                                <th key={column} className="px-3.5 py-2.5 font-medium text-neutral-700 align-bottom">
                                    {column}
                                </th>
                            ))}
                            {hasInlineBuckets && (
                                <th className="whitespace-nowrap px-3.5 py-2.5 font-medium text-neutral-700 align-bottom w-36">
                                    {readOnly ? "Candidate's bucket" : "Your bucket"}
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => {
                            const item = matchedItem(rowIndex);
                            return (
                                <tr key={rowIndex} className="border-t border-neutral-200">
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="px-3.5 py-2.5 text-neutral-950 align-middle">
                                            {cell}
                                        </td>
                                    ))}
                                    {hasInlineBuckets && (
                                        <td className="whitespace-nowrap px-3.5 py-1.5 align-middle w-36">
                                            {item !== undefined && classification && (
                                                <BucketSelect
                                                    value={mapping[item]}
                                                    buckets={classification.component.buckets}
                                                    ariaLabel={`Bucket for ${item}`}
                                                    readOnly={readOnly}
                                                    onChange={(bucket) =>
                                                        classification.onChange({ ...mapping, [item]: bucket })
                                                    }
                                                />
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {classification && hasInlineBuckets && unmatchedItems.length > 0 && (
                <ClassificationAnswer
                    component={{ ...classification.component, items: unmatchedItems }}
                    response={classification.response}
                    onChange={classification.onChange}
                    readOnly={readOnly}
                />
            )}
            {!hasInlineBuckets && objectiveSlot}

            {readOnly ? (
                <ReadOnlyAnswerText value={value} />
            ) : (
                <textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value.slice(0, MAX_CHARS))}
                    placeholder={payload.placeholder ?? "Type your response here..."}
                    className="h-38.25 w-full resize-none rounded-lg border border-neutral-200 px-3.5 py-2.5 text-[16px] text-neutral-700 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] outline-none placeholder:text-neutral-400 focus:border-primary-500"
                />
            )}
        </div>
    );
};

export default TableViewResponsePanelAnswer;
