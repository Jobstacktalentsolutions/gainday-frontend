import { ChevronDown, ChevronUp } from "lucide-react";
import type { ProceduralSequencingCandidateComponent } from "../../types/simulation";

interface Props {
    component: ProceduralSequencingCandidateComponent;
    /** Order of the candidate's arrangement, as indices into component.steps — e.g. [2,0,1]
     *  means "step 2 first, then step 0, then step 1". Defaults to the presented (shuffled)
     *  order until the candidate reorders anything. */
    response: number[] | null;
    onChange: (response: number[]) => void;
}

const ProceduralSequencingAnswer = ({ component, response, onChange }: Props) => {
    const order = response ?? component.steps.map((_, index) => index);

    function move(position: number, direction: -1 | 1) {
        const target = position + direction;
        if (target < 0 || target >= order.length) return;
        const next = [...order];
        [next[position], next[target]] = [next[target], next[position]];
        onChange(next);
    }

    return (
        <div className="flex w-full flex-col gap-3">
            <p className="text-[14px] text-neutral-600">Arrange these steps in the correct order</p>
            {order.map((stepIndex, position) => (
                <div
                    key={stepIndex}
                    className="flex w-full items-center gap-4 rounded-xl border border-[#e6e6e8] px-6 py-3"
                >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[14px] text-primary-500">
                        {position + 1}
                    </span>
                    <span className="flex flex-1 flex-col gap-1">
                        <span className="flex-1 text-[16px] text-primary-950">{component.steps[stepIndex]}</span>
                    </span>
                    <div className="flex shrink-0 flex-col">
                        <button
                            type="button"
                            aria-label="Move up"
                            disabled={position === 0}
                            onClick={() => move(position, -1)}
                            className="text-neutral-400 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ChevronUp className="size-5" />
                        </button>
                        <button
                            type="button"
                            aria-label="Move down"
                            disabled={position === order.length - 1}
                            onClick={() => move(position, 1)}
                            className="text-neutral-400 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ChevronDown className="size-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProceduralSequencingAnswer;
