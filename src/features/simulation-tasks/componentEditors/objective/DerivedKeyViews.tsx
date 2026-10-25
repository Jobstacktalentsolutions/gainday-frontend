import type {
    JournalEntryComponent,
    NumericTableComponent,
    ReconciliationComponent,
} from "../../types";

// Finance answer keys are derived from the task's figures when it is generated, so the employer
// sees them here for review but cannot edit them. Changing the figures means regenerating the task.

const KeyNotice = () => (
    <p className="text-xs text-neutral-500">
        Derived from the task's figures. To change the answer, regenerate the task.
    </p>
);

export const ReconciliationKeyView = ({ value }: { value: ReconciliationComponent }) => (
    <div className="flex flex-col gap-2 text-sm">
        <KeyNotice />
        <ul className="flex flex-col gap-1">
            {value.items.map((item, index) => (
                <li key={item} className="flex justify-between gap-4">
                    <span>{item}</span>
                    <span className="font-medium">
                        {value.sideOptions.find((option) => option.value === value.correctSides[index])?.label}
                    </span>
                </li>
            ))}
        </ul>
        <p>
            Adjusted cash balance: <span className="font-medium">{value.adjustedBalance}</span>
            {value.unit ? ` ${value.unit}` : ""}
        </p>
    </div>
);

export const JournalEntryKeyView = ({ value }: { value: JournalEntryComponent }) => (
    <div className="flex flex-col gap-2 text-sm">
        <KeyNotice />
        {value.entries.map((entry) => (
            <div key={entry.reference}>
                <p className="font-medium">{entry.reference}</p>
                <ul className="ml-4 flex flex-col gap-0.5">
                    {entry.lines.map((line, index) => (
                        <li key={index}>
                            {line.side === "DEBIT" ? "Dr" : "Cr"} {line.account} {line.amount}
                        </li>
                    ))}
                </ul>
            </div>
        ))}
    </div>
);

export const NumericTableKeyView = ({ value }: { value: NumericTableComponent }) => (
    <div className="flex flex-col gap-2 text-sm">
        <KeyNotice />
        <table className="w-full text-left">
            <thead>
                <tr>
                    <th className="pb-1 font-medium" />
                    {value.columns.map((column) => (
                        <th key={column.label} className="pb-1 font-medium">
                            {column.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {value.rowLabels.map((rowLabel, row) => (
                    <tr key={rowLabel}>
                        <td className="py-0.5">{rowLabel}</td>
                        {value.columns.map((column, columnIndex) => (
                            <td key={column.label} className="py-0.5">
                                {value.correctValues[row][columnIndex]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
