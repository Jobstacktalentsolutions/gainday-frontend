import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";
import type { PriorityRankingCandidateComponent } from "../../types/simulation";

interface Props {
    component: PriorityRankingCandidateComponent;
    /** The candidate's ranking as indices into component.items, highest priority first — e.g.
     *  [2,0,1] means "item 2 is the top priority". Defaults to the presented (shuffled) order
     *  until the candidate reorders anything. */
    response: number[] | null;
    onChange: (response: number[]) => void;
    /** Show the submitted ranking without the reorder controls (review pages). */
    readOnly?: boolean;
}

const PriorityRankingAnswer = ({ component, response, onChange, readOnly }: Props) => {
    const order = response ?? component.items.map((_, index) => index);

    if (readOnly && response === null) {
        return <p className="text-sm text-neutral-500">No ranking was submitted.</p>;
    }

    function move(position: number, direction: -1 | 1) {
        const target = position + direction;
        if (target < 0 || target >= order.length) return;
        const next = [...order];
        [next[position], next[target]] = [next[target], next[position]];
        onChange(next);
    }

    return (
        <div className="flex w-full flex-col gap-3">
            {!readOnly && <p className="text-[14px] text-neutral-600">Rank from highest to lowest priority</p>}
            {order.map((itemIndex, position) => {
                const item = component.items[itemIndex];
                return (
                    // Keyed by item index (not position) so motion can animate each card to its new slot.
                    <motion.div
                        key={itemIndex}
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        className="flex w-full items-center gap-4 rounded-xl border border-[#e6e6e8] bg-white px-6 py-4"
                    >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[16px] text-primary-500">
                            {position + 1}
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col">
                            <span className="text-[18px] text-primary-950">{item.label}</span>
                            <span className="text-[14px] text-neutral-500">{item.description}</span>
                        </div>
                        {!readOnly && (
                        <div className="flex shrink-0 flex-col gap-1">
                            <button
                                type="button"
                                aria-label={`Move ${item.label} up`}
                                disabled={position === 0}
                                onClick={() => move(position, -1)}
                                className="rounded-md border border-neutral-300 text-neutral-950 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <ChevronUp className="size-5" />
                            </button>
                            <button
                                type="button"
                                aria-label={`Move ${item.label} down`}
                                disabled={position === order.length - 1}
                                onClick={() => move(position, 1)}
                                className="rounded-md border border-neutral-300 text-neutral-950 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <ChevronDown className="size-5" />
                            </button>
                        </div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
};

export default PriorityRankingAnswer;
