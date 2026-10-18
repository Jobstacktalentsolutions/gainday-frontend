import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { INTERFACE_ANSWER_RENDERERS } from "./interfaceAnswers/registry";
import { TaskObjectiveOptions } from "./TaskObjectiveOptions";
import type { ClassificationAnswerState } from "./interfaceAnswers/types";
import type { CandidateSimulationTask } from "../types/simulation";

export interface SubmittedAnswerValue {
    objectiveResponse: unknown;
    textResponse: string;
}

interface SubmittedAnswerProps {
    /** What is needed to lay the answer out the way the candidate saw it: the task's interface and
     *  its structured component (without answer keys). */
    task: Pick<CandidateSimulationTask, "interfaceType" | "interfacePayload" | "objectiveComponent">;
    /** Null when the candidate submitted nothing for this task. */
    answer: SubmittedAnswerValue | null;
}

const noop = () => undefined;

// A submitted answer shown the way it was given: the same interface renderers and structured
// widgets the candidate used, read-only. Collapsed by default, like the task previews, because a
// review page lists several tasks and the answer is the long part.
export function SubmittedAnswer({ task, answer }: SubmittedAnswerProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (answer === null) {
        return <p className="text-sm text-neutral-500">No answer was submitted for this task.</p>;
    }

    const Renderer = INTERFACE_ANSWER_RENDERERS[task.interfaceType];
    const objective = task.objectiveComponent;
    const classification: ClassificationAnswerState | undefined =
        objective?.componentType === "CLASSIFICATION"
            ? {
                  component: objective,
                  response: answer.objectiveResponse as Record<string, string> | null,
                  onChange: noop,
              }
            : undefined;

    return (
        <div className="flex flex-col gap-3">
            <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((open) => !open)}
                className="flex w-fit cursor-pointer items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
                {isOpen ? "Hide candidate's answer" : "Show candidate's answer"}
                <ChevronDown className={cn("size-4 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen &&
                (Renderer ? (
                    <Renderer
                        readOnly
                        payload={task.interfacePayload}
                        value={answer.textResponse}
                        onChange={noop}
                        objectiveSlot={
                            <TaskObjectiveOptions
                                readOnly
                                task={task}
                                response={answer.objectiveResponse}
                                onChange={noop}
                            />
                        }
                        classification={classification}
                    />
                ) : (
                    <p className="text-sm text-neutral-500">
                        This answer's interface ("{task.interfaceType}") can't be shown.
                    </p>
                ))}
        </div>
    );
}
