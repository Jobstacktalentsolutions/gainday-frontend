import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { InterfaceType } from "@/features/simulation-tasks/types";
import type { SimulationTask, TextAreaPayload } from "@/features/simulation-tasks/types";

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
    // interfacePayload's `placeholder` is task-specific and generated per role/scenario —
    // never a hardcoded example from one particular task (see interface-type.ts).
    const placeholder = (task.interfacePayload as unknown as TextAreaPayload | undefined)?.placeholder
        ?? "Type your response here...";

    return (
        <div className="flex w-full flex-col gap-1.5">
            <div className="flex w-full items-center justify-between text-[16px]">
                <div className="prose prose-sm max-w-none text-neutral-950 prose-p:my-0">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{task.questionPrompt}</ReactMarkdown>
                </div>

                <span className="shrink-0 text-neutral-600">Minimum {MIN_WORDS} words</span>
            </div>
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value.slice(0, MAX_CHARS))}
                placeholder={placeholder}
                className="h-38.25 w-full resize-none rounded-lg border border-neutral-200 px-3.5 py-2.5 text-[16px] text-neutral-700 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] outline-none placeholder:text-neutral-400 focus:border-primary-500"
            />
            <div className="flex w-full items-center justify-between text-[16px] text-neutral-950">
                <span>{wordCount} / {MAX_WORDS} words</span>
                <span>{value.length} / {MAX_CHARS} characters</span>
            </div>
        </div>
    );
}