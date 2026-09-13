import { Plus, X } from "lucide-react";
import type { ClassificationComponent } from "../../types";

interface Props {
    value: ClassificationComponent;
    onChange: (value: ClassificationComponent) => void;
}

const ClassificationEditor = ({ value, onChange }: Props) => {
    const setItem = (index: number, text: string) => {
        const items = [...value.items];
        items[index] = text;
        onChange({ ...value, items });
    };

    const setBucket = (index: number, text: string) => {
        const buckets = [...value.buckets];
        const old = buckets[index];
        buckets[index] = text;
        onChange({
            ...value,
            buckets,
            correctMapping: value.correctMapping.map((m) =>
                m.bucket === old ? { ...m, bucket: text } : m,
            ),
        });
    };

    const setMapping = (item: string, bucket: string) => {
        const rest = value.correctMapping.filter((m) => m.item !== item);
        onChange({ ...value, correctMapping: [...rest, { item, bucket }] });
    };

    const addItem = () =>
        onChange({ ...value, items: [...value.items, ""] });

    const removeItem = (index: number) => {
        const removed = value.items[index];
        onChange({
            ...value,
            items: value.items.filter((_, i) => i !== index),
            correctMapping: value.correctMapping.filter((m) => m.item !== removed),
        });
    };

    const addBucket = () =>
        onChange({ ...value, buckets: [...value.buckets, ""] });

    const removeBucket = (index: number) => {
        const removed = value.buckets[index];
        onChange({
            ...value,
            buckets: value.buckets.filter((_, i) => i !== index),
            correctMapping: value.correctMapping.filter(
                (m) => m.bucket !== removed,
            ),
        });
    };

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
                    Items and their correct bucket
                </label>
                {value.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <input
                            className="flex-1 rounded border border-neutral-200 px-2 py-1.5 text-sm"
                            value={item}
                            onChange={(e) => setItem(i, e.target.value)}
                        />
                        <select
                            className="w-36 rounded border border-neutral-200 px-2 py-1.5 text-sm"
                            value={
                                value.correctMapping.find((m) => m.item === item)?.bucket ?? ""
                            }
                            onChange={(e) => setMapping(item, e.target.value)}
                        >
                            <option value="">Select bucket</option>
                            {value.buckets.map((bucket, bi) => (
                                <option key={bi} value={bucket}>
                                    {bucket}
                                </option>
                            ))}
                        </select>
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
