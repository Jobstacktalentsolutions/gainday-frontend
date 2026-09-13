import { Plus, X } from "lucide-react";
import type { ProceduralSequencingComponent } from "../../types";

interface Props {
    value: ProceduralSequencingComponent;
    onChange: (value: ProceduralSequencingComponent) => void;
}

// correctOrder holds 0-indexed positions into `steps` giving the correct order — edited here as
// a per-step "position" number rather than a separate reorderable list, to keep the UI simple.
const ProceduralSequencingEditor = ({ value, onChange }: Props) => {
    const setStep = (index: number, text: string) => {
        const steps = [...value.steps];
        steps[index] = text;
        onChange({ ...value, steps });
    };

    const setPosition = (stepIndex: number, position: number) => {
        const correctOrder = [...value.correctOrder];
        const existingAt = correctOrder.indexOf(stepIndex);
        if (existingAt !== -1) correctOrder.splice(existingAt, 1);
        correctOrder.splice(position, 0, stepIndex);
        onChange({ ...value, correctOrder });
    };

    const addStep = () =>
        onChange({
            ...value,
            steps: [...value.steps, ""],
            correctOrder: [...value.correctOrder, value.steps.length],
        });

    const removeStep = (index: number) =>
        onChange({
            ...value,
            steps: value.steps.filter((_, i) => i !== index),
            correctOrder: value.correctOrder
                .filter((i) => i !== index)
                .map((i) => (i > index ? i - 1 : i)),
        });

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
                Steps (shuffled for the candidate) — position sets the correct order
            </label>
            {value.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                    <select
                        className="w-16 rounded border border-neutral-200 px-1 py-1.5 text-sm"
                        value={value.correctOrder.indexOf(i)}
                        onChange={(e) => setPosition(i, Number(e.target.value))}
                    >
                        {value.steps.map((_, p) => (
                            <option key={p} value={p}>
                                {p + 1}
                            </option>
                        ))}
                    </select>
                    <input
                        className="flex-1 rounded border border-neutral-200 px-2 py-1.5 text-sm"
                        value={step}
                        onChange={(e) => setStep(i, e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => removeStep(i)}
                        aria-label="Remove step"
                        className="text-neutral-400 hover:text-error-500"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={addStep}
                className="flex w-fit items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
                <Plus className="size-3.5" /> Step
            </button>
        </div>
    );
};

export default ProceduralSequencingEditor;
