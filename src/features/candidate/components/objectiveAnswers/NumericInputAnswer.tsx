import type { NumericInputCandidateComponent } from "../../types/simulation";

interface Props {
    component: NumericInputCandidateComponent;
    response: number | null;
    onChange: (response: number | null) => void;
}

const NumericInputAnswer = ({ component, response, onChange }: Props) => (
    <div className="flex w-full flex-col gap-1.5">
        <label className="text-[16px] text-neutral-950">Your answer</label>
        <div className="flex w-full max-w-64 items-center gap-2">
            <input
                type="number"
                inputMode="decimal"
                value={response ?? ""}
                onChange={(event) => {
                    const value = event.target.value;
                    onChange(value === "" ? null : Number(value));
                }}
                placeholder="0"
                className="w-full rounded-lg border border-neutral-200 px-3.5 py-2.5 text-[16px] text-neutral-700 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] outline-none focus:border-primary-500"
            />
            {component.unit && <span className="shrink-0 text-[16px] text-neutral-500">{component.unit}</span>}
        </div>
    </div>
);

export default NumericInputAnswer;
