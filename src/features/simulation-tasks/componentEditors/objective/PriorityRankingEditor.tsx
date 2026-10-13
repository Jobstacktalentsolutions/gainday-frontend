import { Plus, X } from "lucide-react";
import type { PriorityRankingComponent } from "../../types";

interface Props {
    value: PriorityRankingComponent;
    onChange: (value: PriorityRankingComponent) => void;
}

// idealOrder holds 0-indexed positions into `items`, highest priority first — edited here as a
// per-item "rank" number, same approach as ProceduralSequencingEditor.
const PriorityRankingEditor = ({ value, onChange }: Props) => {
    const setItem = (index: number, patch: Partial<PriorityRankingComponent["items"][number]>) => {
        const items = value.items.map((item, i) => (i === index ? { ...item, ...patch } : item));
        onChange({ ...value, items });
    };

    const setRank = (itemIndex: number, rank: number) => {
        const idealOrder = value.idealOrder.filter((i) => i !== itemIndex);
        idealOrder.splice(rank, 0, itemIndex);
        onChange({ ...value, idealOrder });
    };

    const addItem = () =>
        onChange({
            ...value,
            items: [...value.items, { label: "", description: "" }],
            idealOrder: [...value.idealOrder, value.items.length],
        });

    const removeItem = (index: number) =>
        onChange({
            ...value,
            items: value.items.filter((_, i) => i !== index),
            idealOrder: value.idealOrder
                .filter((i) => i !== index)
                .map((i) => (i > index ? i - 1 : i)),
        });

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
                Items (shuffled for the candidate) — rank sets the ideal priority order
            </label>
            {value.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                    <select
                        className="w-16 rounded border border-neutral-200 px-1 py-1.5 text-sm"
                        value={value.idealOrder.indexOf(i)}
                        onChange={(e) => setRank(i, Number(e.target.value))}
                    >
                        {value.items.map((_, p) => (
                            <option key={p} value={p}>
                                {p + 1}
                            </option>
                        ))}
                    </select>
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
            <label className="mt-2 text-sm font-medium text-neutral-700">
                Why this order (grader reference, never shown to the candidate)
            </label>
            <textarea
                className="min-h-20 rounded border border-neutral-200 px-2 py-1.5 text-sm"
                value={value.idealOrderRationale}
                onChange={(e) => onChange({ ...value, idealOrderRationale: e.target.value })}
            />
        </div>
    );
};

export default PriorityRankingEditor;
