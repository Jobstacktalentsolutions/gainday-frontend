import type { JournalEntryCandidateComponent, JournalEntryLine, JournalEntryResponse } from "../../types/simulation";

interface Props {
    component: JournalEntryCandidateComponent;
    response: JournalEntryResponse | null;
    onChange: (response: JournalEntryResponse) => void;
}

const SIDES = ["DEBIT", "CREDIT"] as const;

// The candidate posts one or more lines against each transaction: an account, a side and an amount.
// The grader matches each transaction's lines exactly, so partial entries earn nothing.
const JournalEntryAnswer = ({ component, response, onChange }: Props) => {
    const lines = response === null ? [] : response.lines;

    const update = (next: JournalEntryLine[]) => onChange({ lines: next });

    const setLine = (index: number, patch: Partial<JournalEntryLine>) =>
        update(lines.map((line, i) => (i === index ? { ...line, ...patch } : line)));

    const addLine = () =>
        update([...lines, { reference: component.references[0], account: null, side: null, amount: null }]);

    const removeLine = (index: number) => update(lines.filter((_, i) => i !== index));

    return (
        <div className="flex w-full flex-col gap-3">
            {lines.map((line, index) => (
                <div
                    key={index}
                    className="grid w-full grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_auto] items-center gap-3"
                >
                    <select
                        aria-label={`Transaction for line ${index + 1}`}
                        value={line.reference}
                        onChange={(event) => setLine(index, { reference: event.target.value })}
                        className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-sm text-neutral-700 outline-none focus:border-primary-500"
                    >
                        {component.references.map((reference) => (
                            <option key={reference} value={reference}>
                                {reference}
                            </option>
                        ))}
                    </select>
                    <select
                        aria-label={`Account for line ${index + 1}`}
                        value={line.account ?? ""}
                        onChange={(event) => setLine(index, { account: event.target.value === "" ? null : event.target.value })}
                        className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-sm text-neutral-700 outline-none focus:border-primary-500"
                    >
                        <option value="" disabled>
                            Choose an account
                        </option>
                        {component.accounts.map((account) => (
                            <option key={account} value={account}>
                                {account}
                            </option>
                        ))}
                    </select>
                    <select
                        aria-label={`Side for line ${index + 1}`}
                        value={line.side ?? ""}
                        onChange={(event) =>
                            setLine(index, {
                                side: event.target.value === "" ? null : (event.target.value as JournalEntryLine["side"]),
                            })
                        }
                        className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-sm text-neutral-700 outline-none focus:border-primary-500"
                    >
                        <option value="" disabled>
                            Side
                        </option>
                        {SIDES.map((side) => (
                            <option key={side} value={side}>
                                {side === "DEBIT" ? "Debit" : "Credit"}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        inputMode="decimal"
                        aria-label={`Amount for line ${index + 1}`}
                        value={line.amount ?? ""}
                        onChange={(event) =>
                            setLine(index, { amount: event.target.value === "" ? null : Number(event.target.value) })
                        }
                        placeholder={component.unit ?? "Amount"}
                        className="rounded-lg border border-neutral-200 px-2.5 py-1.5 text-sm text-neutral-700 outline-none focus:border-primary-500"
                    />
                    <button
                        type="button"
                        onClick={() => removeLine(index)}
                        className="text-sm text-neutral-500 hover:text-error-500"
                    >
                        Remove
                    </button>
                </div>
            ))}
            <button type="button" onClick={addLine} className="self-start text-sm text-primary-600 hover:text-primary-700">
                + Add line
            </button>
        </div>
    );
};

export default JournalEntryAnswer;
