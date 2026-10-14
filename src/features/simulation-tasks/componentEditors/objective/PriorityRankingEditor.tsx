import { Plus, X } from "lucide-react";
import type { PriorityRankingComponent } from "../../types";

interface Props {
    value: PriorityRankingComponent;
    onChange: (value: PriorityRankingComponent) => void;
}

// Items are shown to the candidate in the order listed here, so keep them shuffled — there is no
// stored "correct" order; what counts as a good ranking is defined later by the grading anchors.
const PriorityRankingEditor = ({ value, onChange }: Props) => {
    const setItem = (index: number, patch: Partial<PriorityRankingComponent["items"][number]>) =>
        onChange({
            ...value,
            items: value.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
        });

    const addItem = () =>
        onChange({ ...value, items: [...value.items, { label: "", description: "" }] });

    const removeItem = (index: number) =>
        onChange({ ...value, items: value.items.filter((_, i) => i !== index) });

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
                Items to rank (shown to the candidate in this order)
            </label>
            {value.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                    <div className="flex flex-1 flex-col gap-1">
                        <input
                            className="rounded border border-neutral-200 px-2 py-1.5 text-sm"
                            placeholder="Label"
                            value={item.label}
                            onChange={(e) => setItem(i, { label: e.target.value })}
                        />
                        <input
                            className="rounded border border-neutral-200 px-2 py-1.5 text-sm"
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => setItem(i, { description: e.target.value })}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => removeItem(i)}
                        aria-label="Remove item"
                        className="mt-1.5 text-neutral-400 hover:text-error-500"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={addItem}
                className="flex w-fit items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
                <Plus className="size-3.5" /> Item
            </button>
        </div>
    );
};

export default PriorityRankingEditor;
