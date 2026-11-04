import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { INTERFACE_ANSWER_RENDERERS } from "./interfaceAnswers/registry";
import { TaskObjectiveOptions } from "./TaskObjectiveOptions";
import type { ClassificationAnswerState } from "./interfaceAnswers/types";
import type { CandidateSimulationTask } from "../types/simulation";
import {
    MAX_RESPONSE_CHARS,
    capResponse,
    countWords,
    limitState,
    limitTextClass,
} from "../utils/responseLimits";

interface TaskResponseInputProps {
    task: CandidateSimulationTask;
    value: string;
    onChange: (value: string) => void;
    /** The candidate's answer to the task's structured (objective) part, if it has one. */
    objectiveResponse: unknown;
    onObjectiveChange: (response: unknown) => void;
}

const DEFAULT_WORD_LIMIT = { min: 25, max: 150 };

// A task may state the length it asks for in its payload (customer service case files do). Without
// one, the default limits apply.
function wordLimitOf(payload: Record<string, unknown>): { min: number; max: number } {
    const limit = payload.wordLimit;
    if (typeof limit === "object" && limit !== null && "min" in limit && "max" in limit) {
        return { min: Number(limit.min), max: Number(limit.max) };
    }
    return DEFAULT_WORD_LIMIT;
}

// Which widget renders is resolved entirely through INTERFACE_ANSWER_RENDERERS, keyed by
// task.interfaceType — this component doesn't special-case any one interface type, so a new
// InterfaceType only needs an entry in that registry (see interfaceAnswers/registry.tsx).
//
// The structured answer is handed to the interface rather than rendered above it: each
// interface puts it after its own reference material (a table, say) and before the written
// response, and a table can take a classification on its rows.
export function TaskResponseInput({
    task,
    value,
    onChange,
    objectiveResponse,
    onObjectiveChange,
}: TaskResponseInputProps) {
    const Renderer = INTERFACE_ANSWER_RENDERERS[task.interfaceType];
    const wordCount = countWords(value);
    const wordLimit = wordLimitOf(task.interfacePayload);
    const wordState = limitState(wordCount, wordLimit.max);
    const charState = limitState(value.length, MAX_RESPONSE_CHARS);
    // Every change goes through the caps, so no interface can store a response past either limit.
    const setResponse = (next: string) => onChange(capResponse(next, wordLimit.max));

    const objectiveSlot = (
        <TaskObjectiveOptions task={task} response={objectiveResponse} onChange={onObjectiveChange} />
    );

    const objective = task.objectiveComponent;
    const classification: ClassificationAnswerState | undefined =
        objective?.componentType === "CLASSIFICATION"
            ? {
                  component: objective,
                  response: objectiveResponse as Record<string, string> | null,
                  onChange: onObjectiveChange,
              }
            : undefined;

    return (
        <div className="flex w-full flex-col gap-1.5">
            <div className="flex w-full flex-col gap-1">
                <div className="prose prose-sm max-w-none text-neutral-950 prose-p:my-0">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{task.questionPrompt}</ReactMarkdown>
                </div>

                {wordLimit.min > 0 && (
                    <span className="self-end text-xs text-neutral-500">Minimum {wordLimit.min} words</span>
                )}
            </div>

            {Renderer ? (
                <Renderer
                    payload={task.interfacePayload}
                    value={value}
                    onChange={setResponse}
                    objectiveSlot={objectiveSlot}
                    classification={classification}
                />
            ) : (
                <>
                    {objectiveSlot}
                    <div className="w-full rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-[16px] text-neutral-400">
                        This response type ("{task.interfaceType}") isn't supported yet.
                    </div>
                </>
            )}

            <div className="flex w-full items-center justify-between text-[16px] text-neutral-950">
                <span className={cn(limitTextClass(wordState))}>{wordCount} / {wordLimit.max} words</span>
                <span className={cn(limitTextClass(charState))}>{value.length} / {MAX_RESPONSE_CHARS} characters</span>
            </div>
        </div>
    );
}
