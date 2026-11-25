import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { TableViewResponsePanelPayload } from "@/features/simulation-tasks/types";
import TaskChart from "@/features/simulation-tasks/charts/TaskChart";
import ClassificationAnswer from "../objectiveAnswers/ClassificationAnswer";
import BucketSelect from "../objectiveAnswers/BucketSelect";
import { ItemReasons } from "../objectiveAnswers/ItemReasons";
import { WrittenAnswer } from "./AnswerDock";
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
    const inlineClassification = classification &&
        rows.length === classification.component.items.length &&
        rows.every((row, index) => row[0] === classification.component.items[index]);

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
                            {inlineClassification && <th className="px-3.5 py-2.5 font-medium text-neutral-700">Classification</th>}
                            {inlineClassification && <th className="min-w-64 px-3.5 py-2.5 font-medium text-neutral-700">Reason</th>}

                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-t border-neutral-200">
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className={cn("px-3.5 py-2.5 text-neutral-950 align-middle", cellIndex === 0 && "whitespace-nowrap font-medium")}>{cell}</td>
                                ))}
                                {inlineClassification && classification && <td className="px-3.5 py-2.5"><BucketSelect
                                    ariaLabel={`Classification for ${row[0]}`}
                                    buckets={classification.component.buckets}
                                    value={classification.response?.[row[0]]}
                                    onChange={(bucket) => classification.onChange({ ...classification.response, [row[0]]: bucket })}
                                    readOnly={readOnly}
                                /></td>}
                                {inlineClassification && classification && <td className="px-3.5 py-2.5">{readOnly
                                    ? classification.reasons?.[row[0]]
                                    : <textarea aria-label={`Reason for ${row[0]}`} rows={2} value={classification.reasons?.[row[0]] ?? ""} onChange={(event) => classification.onReasonsChange?.({ ...classification.reasons, [row[0]]: event.target.value })} className="w-full min-w-64 resize-y rounded-lg border border-neutral-200 p-2 text-sm outline-none focus:border-primary-500" />}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {inlineClassification ? null : classification ? (
                <>
                    <ClassificationAnswer component={classification.component} response={classification.response} onChange={classification.onChange} readOnly={readOnly} />
                    <ItemReasons component={classification.component} reasons={classification.reasons} onChange={classification.onReasonsChange ?? (() => undefined)} readOnly={readOnly} />
                </>
            ) : objectiveSlot}

            {classification && classification.response && Object.keys(classification.response).length > 0 && <details className="rounded-lg border border-neutral-200 p-3">
                <summary className="cursor-pointer text-sm font-medium text-neutral-700">Preview your classifications</summary>
                <TaskChart chart={{ type: "bar", categories: classification.component.buckets, series: [{ name: "Items", values: classification.component.buckets.map((bucket) => classification.component.items.filter((item) => classification.response?.[item] === bucket).length) }] }} />
            </details>}

            {readOnly ? (
                <ReadOnlyAnswerText value={value} />
            ) : (
                <WrittenAnswer><label className="flex flex-col gap-2 text-sm font-medium text-neutral-700">
                {classification ? "Additional response" : "Your response"}
                <textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={payload.placeholder ?? "Type your response here..."}
                    className="h-38.25 w-full resize-none rounded-lg border border-neutral-200 px-3.5 py-2.5 text-[16px] text-neutral-700 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] outline-none placeholder:text-neutral-400 focus:border-primary-500"
                />
                </label></WrittenAnswer>
            )}
        </div>
    );
};

export default TableViewResponsePanelAnswer;
