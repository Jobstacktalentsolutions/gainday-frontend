import { Plus, X } from "lucide-react";
import { FormInput } from "@/components/form/FormInput";
import type { MultiSelectUnderConstraintComponent } from "../../types";

interface Props {
    value: MultiSelectUnderConstraintComponent;
    onChange: (value: MultiSelectUnderConstraintComponent) => void;
}

const MultiSelectUnderConstraintEditor = ({ value, onChange }: Props) => {
    const toggleCorrect = (index: number) => {
        const set = new Set(value.correctOptionIndices);
        if (set.has(index)) {
            set.delete(index);
        } else {
            set.add(index);
        }
        onChange({ ...value, correctOptionIndices: [...set].sort() });
    };

    const setOption = (index: number, text: string) => {
        const options = [...value.options];
        options[index] = text;
        onChange({ ...value, options });
    };

    const addOption = () =>
        onChange({ ...value, options: [...value.options, ""] });

    const removeOption = (index: number) =>
        onChange({
            ...value,
            options: value.options.filter((_, i) => i !== index),
            correctOptionIndices: value.correctOptionIndices
                .filter((i) => i !== index)
                .map((i) => (i > index ? i - 1 : i)),
        });

    return (
        <div className="flex flex-col gap-3">
            <FormInput
                label="Number of options the candidate must select"
                type="number"
                value={value.selectCount}
                onChange={(e) =>
                    onChange({ ...value, selectCount: Number(e.target.value) })
                }
            />
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-700">
                    Options (check the ideal selection)
                </label>
                {value.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={value.correctOptionIndices.includes(i)}
                            onChange={() => toggleCorrect(i)}
                        />
                        <input
                            className="flex-1 rounded border border-neutral-200 px-2 py-1.5 text-sm"
                            value={opt}
                            onChange={(e) => setOption(i, e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => removeOption(i)}
                            aria-label="Remove option"
                            className="text-neutral-400 hover:text-error-500"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addOption}
                    className="flex w-fit items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                >
                    <Plus className="size-3.5" /> Option
                </button>
            </div>
        </div>
    );
};

export default MultiSelectUnderConstraintEditor;
