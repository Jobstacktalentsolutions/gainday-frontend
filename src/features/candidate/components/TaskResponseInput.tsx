import { InterfaceType } from "@/features/simulation-tasks/types";
import type { SimulationTask } from "@/features/simulation-tasks/types";

interface TaskResponseInputProps {
    task: SimulationTask;
    value: string;
    onChange: (value: string) => void;
}

const MIN_WORDS = 25;
const MAX_WORDS = 150;
const MAX_CHARS = 1000;

function countWords(text: string) {
    const trimmed = text.trim();
    return trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
}

export function TaskResponseInput({ task, value, onChange }: TaskResponseInputProps) {
    if (task.interfaceType !== InterfaceType.TEXT_AREA) {
        return (
            <div className="w-full rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-[16px] text-neutral-400">
                This response type ("{task.interfaceType}") isn't supported yet.
            </div>
        );
    }

    const wordCount = countWords(value);

    return (
        <div className="flex w-full flex-col gap-1.5">
            <div className="flex w-full items-center justify-between text-[16px]">
                <span className="text-neutral-950">{task.questionPrompt}</span>
                
                <span className="text-neutral-600">Minimum {MIN_WORDS} words</span>
            </div>
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value.slice(0, MAX_CHARS))}
                placeholder="List each field that does not agree, the correct value, and who must amend the record..."
                className="h-38.25 w-full resize-none rounded-lg border border-neutral-200 px-3.5 py-2.5 text-[16px] text-neutral-700 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] outline-none placeholder:text-neutral-400 focus:border-primary-500"
            />
            <div className="flex w-full items-center justify-between text-[16px] text-neutral-950">
                <span>{wordCount} / {MAX_WORDS} words</span>
                <span>{value.length} / {MAX_CHARS} characters</span>
            </div>
        </div>
    );
}