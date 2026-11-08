import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { INTERFACE_ANSWER_RENDERERS } from "./interfaceAnswers/registry";
import { TaskObjectiveOptions } from "./TaskObjectiveOptions";
import type { ClassificationAnswerState } from "./interfaceAnswers/types";
import type { CandidateSimulationTask } from "../types/simulation";
import {
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
    // Every change goes through the word cap, so no interface can store a response past the limit.
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
        <div className="flex w-full flex-col gap-2">
            <div className="flex w-full flex-col gap-1.5">
                <div className="prose max-w-none text-[15px] font-normal leading-relaxed text-neutral-950 prose-p:my-1">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{task.questionPrompt}</ReactMarkdown>
                </div>

                {wordLimit.min > 0 && (
                    <div className="flex justify-end">
                        <span className="rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                            Minimum {wordLimit.min} words
                        </span>
                    </div>
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

            <div className="flex w-full items-center justify-end text-[14px] text-neutral-950">
                <span className={cn(limitTextClass(wordState))}>{wordCount} / {wordLimit.max} words</span>
            </div>
        </div>
    );
}
