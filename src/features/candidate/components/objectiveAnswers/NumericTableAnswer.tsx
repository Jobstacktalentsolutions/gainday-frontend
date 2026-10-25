import type { NumericTableCandidateComponent, NumericTableResponse } from "../../types/simulation";

interface Props {
    component: NumericTableCandidateComponent;
    response: NumericTableResponse | null;
    onChange: (response: NumericTableResponse) => void;
}

// One numeric answer per row and column: the candidate fills in each figure the question asks for.
const NumericTableAnswer = ({ component, response, onChange }: Props) => {
    const values =
        response === null ? component.rowLabels.map(() => component.columnLabels.map(() => null)) : response.values;

    const setCell = (row: number, column: number, raw: string) => {
        const next = values.map((cells) => [...cells]);
        next[row][column] = raw === "" ? null : Number(raw);
        onChange({ values: next });
    };

    return (
        <div className="w-full overflow-x-auto rounded-xl border border-neutral-200">
            <table className="w-full text-left text-[14px]">
                <thead className="bg-neutral-50">
                    <tr>
                        <th className="px-3.5 py-2.5 font-medium text-neutral-700" />
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
                            {component.columnLabels.map((label, column) => (
                                <td key={label} className="px-3.5 py-1.5">
                                    <input
                                        type="number"
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
    );
};

export default NumericTableAnswer;
