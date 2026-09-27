import type { SingleBestActionCandidateComponent } from "../../types/simulation";

interface Props {
    component: SingleBestActionCandidateComponent;
    response: number | null;
    onChange: (response: number) => void;
}

const SingleBestActionAnswer = ({ component, response, onChange }: Props) => (
    <div className="flex w-full flex-col gap-6">
        {component.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            const isSelected = response === index;
            return (
                <button
                    key={option}
                    type="button"
                    onClick={() => onChange(index)}
                    className="flex w-full items-center gap-6 rounded-xl border border-[#e6e6e8] px-6 py-3 text-left transition-colors hover:border-primary-300"
                >
                    <span
                        className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-primary-500 bg-primary-500" : "border-neutral-200"
                            }`}
                    >
                        {isSelected && <span className="size-2 rounded-full bg-white" />}
                    </span>
                    <span className="text-[18px] leading-[1.2] text-primary-950">
                        {letter}. {option}
                    </span>
                </button>
            );
        })}
    </div>
);

export default SingleBestActionAnswer;
