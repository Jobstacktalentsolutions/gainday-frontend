import type { NumericTableCandidateComponent, NumericTableResponse } from "../../types/simulation";
import TaskChart from "@/features/simulation-tasks/charts/TaskChart";

interface Props {
    component: NumericTableCandidateComponent;
    response: NumericTableResponse | null;
    onChange: (response: NumericTableResponse) => void;
    readOnly?: boolean;
    referenceTable?: { columns: string[]; rows: string[][] };
}

// One numeric answer per row and column: the candidate fills in each figure the question asks for.
const NumericTableAnswer = ({ component, response, onChange, readOnly, referenceTable }: Props) => {
    const values =
        response === null ? component.rowLabels.map(() => component.columnLabels.map(() => null)) : response.values;
    const paired = referenceTable && referenceTable.rows.length === component.rowLabels.length && referenceTable.rows.every((row, index) => row[0] === component.rowLabels[index]);

    const setCell = (row: number, column: number, raw: string) => {
        const next = values.map((cells) => [...cells]);
        next[row][column] = raw === "" ? null : Number(raw);
        onChange({ values: next });
    };

    return (
        <div className="w-full">
        <div className="w-full overflow-x-auto rounded-xl border border-neutral-200">
            <table className="w-full text-left text-[14px]">
                <thead className="bg-neutral-50">
                    <tr>
                        <th className="px-3.5 py-2.5 font-medium text-neutral-700" />
                        {paired && referenceTable.columns.slice(1).map((label, index) => <th key={index} className="px-3.5 py-2.5 font-medium text-neutral-700">{label}</th>)}
                        {component.columnLabels.map((label) => (
                            <th key={label} className="px-3.5 py-2.5 font-medium text-neutral-700 align-bottom">
                                {label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {component.rowLabels.map((rowLabel, row) => (
                        <tr key={rowLabel} className="border-t border-neutral-200">
                            <th className="px-3.5 py-2.5 text-left font-medium text-neutral-950">{rowLabel}</th>
                            {paired && referenceTable.rows[row].slice(1).map((value, index) => <td key={index} className="px-3.5 py-2.5">{value}</td>)}
                            {component.columnLabels.map((label, column) => (
                                <td key={label} className="px-3.5 py-1.5">
                                    <input
                                        type="number"
                                        readOnly={readOnly}
                                        inputMode="decimal"
                                        aria-label={`${label} for ${rowLabel}`}
                                        value={values[row][column] ?? ""}
                                        onChange={(event) => setCell(row, column, event.target.value)}
                                        className="w-full min-w-24 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-sm text-neutral-700 outline-none focus:border-primary-500"
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {values.every((row) => row.every((value) => value !== null)) && <details className="mt-3 rounded-lg border border-neutral-200 p-3">
            <summary className="cursor-pointer text-sm font-medium text-neutral-700">Preview your values as a chart</summary>
            <TaskChart chart={{ type: "bar", categories: component.rowLabels, series: component.columnLabels.map((name, column) => ({ name, values: values.map((row) => row[column] as number) })) }} />
        </details>}
        </div>
    );
};

export default NumericTableAnswer;
