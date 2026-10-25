import type { ReconciliationCandidateComponent, ReconciliationResponse } from "../../types/simulation";

interface Props {
    component: ReconciliationCandidateComponent;
    response: ReconciliationResponse | null;
    onChange: (response: ReconciliationResponse) => void;
}

// The candidate sorts each reconciling item to the statement it adjusts, then enters the adjusted
// balance that both statements reconcile to.
const ReconciliationAnswer = ({ component, response, onChange }: Props) => {
    const current: ReconciliationResponse =
        response === null ? { sides: component.items.map(() => null), adjustedBalance: null } : response;

    const setSide = (index: number, side: string) => {
        const sides = [...current.sides];
        sides[index] = side === "" ? null : side;
        onChange({ ...current, sides });
    };

    return (
        <div className="flex w-full flex-col gap-3">
            {component.items.map((item, index) => (
                <div
                    key={item}
                    className="flex w-full items-center justify-between gap-4 rounded-xl border border-[#e6e6e8] px-6 py-3"
                >
                    <span className="text-[16px] text-primary-950">{item}</span>
                    <select
                        aria-label={`Side for ${item}`}
                        value={current.sides[index] ?? ""}
                        onChange={(event) => setSide(index, event.target.value)}
                        className="w-full max-w-64 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-sm text-neutral-700 outline-none focus:border-primary-500"
                    >
                        <option value="" disabled>
                            Choose a side
                        </option>
                        {component.sideOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            ))}

            <div className="flex w-full flex-col gap-1.5">
                <label className="text-[16px] text-neutral-950">Adjusted cash balance</label>
                <div className="flex w-full max-w-64 items-center gap-2">
                    <input
                        type="number"
                        inputMode="decimal"
                        aria-label="Adjusted cash balance"
                        value={current.adjustedBalance ?? ""}
                        onChange={(event) =>
                            onChange({
                                ...current,
                                adjustedBalance: event.target.value === "" ? null : Number(event.target.value),
                            })
                        }
                        className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-[16px] text-neutral-700 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] outline-none focus:border-primary-500"
                    />
                    {component.unit && <span className="shrink-0 text-[16px] text-neutral-500">{component.unit}</span>}
                </div>
            </div>
        </div>
    );
};

export default ReconciliationAnswer;
