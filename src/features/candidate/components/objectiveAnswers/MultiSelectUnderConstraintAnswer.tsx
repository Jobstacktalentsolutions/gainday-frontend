import type { MultiSelectUnderConstraintCandidateComponent } from "../../types/simulation";

interface Props {
    component: MultiSelectUnderConstraintCandidateComponent;
    response: number[] | null;
    onChange: (response: number[]) => void;
}

const MultiSelectUnderConstraintAnswer = ({ component, response, onChange }: Props) => {
    const selected = response ?? [];
    const atLimit = selected.length >= component.selectCount;

    function toggle(index: number) {
        if (selected.includes(index)) {
            onChange(selected.filter((i) => i !== index));
        } else if (!atLimit) {
            onChange([...selected, index]);
        }
    }

    return (
        <div className="flex w-full flex-col gap-3">
            <p className="text-[14px] text-neutral-600">
                Select exactly {component.selectCount} ({selected.length}/{component.selectCount} chosen)
            </p>
            <div className="flex w-full flex-col gap-6">
                {component.options.map((option, index) => {
                    const letter = String.fromCharCode(65 + index);
                    const isSelected = selected.includes(index);
                    const isDisabled = !isSelected && atLimit;
                    return (
                        <button
                            key={option}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => toggle(index)}
                            className="flex w-full items-center gap-6 rounded-xl border border-[#e6e6e8] px-6 py-3 text-left transition-colors hover:border-primary-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#e6e6e8]"
                        >
                            <span
                                className={`flex size-5 shrink-0 items-center justify-center rounded border ${isSelected ? "border-primary-500 bg-primary-500" : "border-neutral-200"
                                    }`}
                            >
                                {isSelected && <span className="size-2 rounded-xs bg-white" />}
                            </span>
                            <span className="text-[18px] leading-[1.2] text-primary-950">
                                {letter}. {option}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MultiSelectUnderConstraintAnswer;
