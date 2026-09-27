import type { SimulationTask } from "@/features/simulation-tasks/types";

interface TaskObjectiveOptionsProps {
    task: SimulationTask;
    selectedIndex: number | null;
    onSelect: (index: number) => void;
}

// Only SINGLE_BEST_ACTION (an { options: string[]; correctOptionIndex }
// shape) is designed in Figma. Everything else — NUMERIC_INPUT,
// CLASSIFICATION, PROCEDURAL_SEQUENCING, MULTI_SELECT_UNDER_CONSTRAINT —
// falls back to a placeholder, per your call (4a).
export function TaskObjectiveOptions({ task, selectedIndex, onSelect }: TaskObjectiveOptionsProps) {
    const component = task.objectiveComponent as { options?: string[] } | undefined;
    const options = component?.options;

    if (!Array.isArray(options)) {
        return (
            <div className="w-full rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-[16px] text-neutral-400">
                This task type ("{task.taskType}") isn't supported yet.
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-6">
            {options.map((option, index) => {
                const letter = String.fromCharCode(65 + index);
                const isSelected = selectedIndex === index;
                return (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onSelect(index)}
                        className="flex w-full items-center gap-6 rounded-xl border border-[#e6e6e8] px-6 py-3 text-left transition-colors hover:border-primary-300"
                    >
                        <span
                            className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-primary-500 bg-primary-500" : "border-neutral-200"
                                }`}
                        >
                            {isSelected && <span className="size-2 rounded-full bg-white" />}
                        </span>
                        <span className="flex flex-col gap-1">
                            <span className="text-[18px] leading-[1.2] text-primary-950">
                                {letter}. {option}
                            </span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
}