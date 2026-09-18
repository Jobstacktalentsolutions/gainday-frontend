import { Plus, X } from "lucide-react";
import type { SingleBestActionComponent } from "../../types";

interface Props {
    value: SingleBestActionComponent;
    onChange: (value: SingleBestActionComponent) => void;
}

const SingleBestActionEditor = ({ value, onChange }: Props) => {
    const setOption = (index: number, text: string) => {
        const options = [...value.options];
        options[index] = text;
        onChange({ ...value, options });
    };

    const addOption = () =>
        onChange({ ...value, options: [...value.options, ""] });

    const removeOption = (index: number) => {
        const options = value.options.filter((_, i) => i !== index);
        const correctOptionIndex =
            value.correctOptionIndex === index
                ? 0
                : value.correctOptionIndex > index
                    ? value.correctOptionIndex - 1
                    : value.correctOptionIndex;
        onChange({ ...value, options, correctOptionIndex });
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
                Options (select the correct one)
            </label>
            {value.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="correctOptionIndex"
                        checked={value.correctOptionIndex === i}
                        onChange={() => onChange({ ...value, correctOptionIndex: i })}
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
    );
};

export default SingleBestActionEditor;
