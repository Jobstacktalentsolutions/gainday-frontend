import { Plus, X } from "lucide-react";
import type { ClassificationComponent } from "../../types";

interface Props {
    value: ClassificationComponent;
    onChange: (value: ClassificationComponent) => void;
}

// No correct bucket is stored per item: what a strong bucketing looks like is decided later,
// during anchor generation. For a task that shows a table, each item should equal the first
// cell of one table row — that is how the candidate's bucket picker lands on that row.
const ClassificationEditor = ({ value, onChange }: Props) => {
    const setItem = (index: number, text: string) => {
        const items = [...value.items];
        items[index] = text;
        onChange({ ...value, items });
    };

    const setBucket = (index: number, text: string) => {
        const buckets = [...value.buckets];
        buckets[index] = text;
        onChange({ ...value, buckets });
    };

    const addItem = () => onChange({ ...value, items: [...value.items, ""] });

    const removeItem = (index: number) =>
        onChange({ ...value, items: value.items.filter((_, i) => i !== index) });

    const addBucket = () => onChange({ ...value, buckets: [...value.buckets, ""] });

    const removeBucket = (index: number) =>
        onChange({ ...value, buckets: value.buckets.filter((_, i) => i !== index) });

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-700">Buckets</label>
                <div className="flex flex-wrap gap-2">
                    {value.buckets.map((bucket, i) => (
                        <div key={i} className="flex items-center gap-1">
                            <input
                                className="w-32 rounded border border-neutral-200 px-2 py-1 text-sm"
                                value={bucket}
                                onChange={(e) => setBucket(i, e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => removeBucket(i)}
                                aria-label="Remove bucket"
                                className="text-neutral-400 hover:text-error-500"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addBucket}
                        className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                        <Plus className="size-3.5" /> Bucket
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-700">
                    Items to sort (match the first cell of a table row)
                </label>
                {value.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <input
                            className="flex-1 rounded border border-neutral-200 px-2 py-1.5 text-sm"
                            value={item}
                            onChange={(e) => setItem(i, e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => removeItem(i)}
                            aria-label="Remove item"
                            className="text-neutral-400 hover:text-error-500"
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
        </div>
    );
};

export default ClassificationEditor;
