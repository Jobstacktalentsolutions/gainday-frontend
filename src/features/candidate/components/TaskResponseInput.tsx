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

const DEFAULT_MAX_WORDS = 250;

function wordLimitOf(payload: Record<string, unknown>): { max: number } {
    const limit = payload.wordLimit;
    if (typeof limit === "object" && limit !== null && "max" in limit && Number(limit.max) > 0) {
        return { max: Number(limit.max) };
    }
    if (typeof limit === "number" && limit > 0) {
        return { max: limit };
    }
    return { max: DEFAULT_MAX_WORDS };
}

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
                <span className={cn(limitTextClass(wordState))}>
                    {wordCount} / {wordLimit.max} words
                </span>
            </div>
        </div>
    );
}
