import { ChevronDown } from "lucide-react";
import Markdown from "@/components/ui/Markdown";
import { cn } from "@/lib/utils";
import TaskTypeBadge from "./TaskTypeBadge";
import { InterfaceRendererView } from "@/features/simulation-tasks/interfaceRenderers/registry";
import type { SimulationTask } from "@/features/simulation-tasks/types";

interface TaskSummaryCardProps {
    index: number;
    task: SimulationTask;
    open: boolean;
    onToggle: () => void;
}

const TaskSummaryCard = ({ index, task, open, onToggle }: TaskSummaryCardProps) => {
    const panelId = `task-summary-${task.id}`;

    return (
        <div className="rounded-2xl border border-neutral-200 bg-white">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex w-full cursor-pointer items-center gap-3 rounded-2xl p-5 text-left transition-colors hover:bg-neutral-50/70"
            >
                <p className="shrink-0 text-sm font-bold uppercase tracking-wide text-neutral-900">Task {index + 1}</p>
                <TaskTypeBadge taskType={task.taskType} interfaceType={task.interfaceType} />
                <p className="min-w-0 flex-1 truncate text-base font-medium text-neutral-950">{task.title}</p>
                <ChevronDown
                    className={cn("size-5 shrink-0 text-neutral-400 transition-transform duration-300", open && "rotate-180")}
                    aria-hidden="true"
                />
            </button>

            {/* grid-rows 0fr -> 1fr animates the height without measuring it */}
            <div
                id={panelId}
                aria-hidden={!open}
                className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
            >
                <div className="overflow-hidden">
                    <div className="flex flex-col gap-4 px-5 pb-5">
                        {Boolean(task.scenarioDescription?.trim()) && (
                            <div className="rounded-xl bg-neutral-50/50 p-4">
                                <Markdown>{task.scenarioDescription}</Markdown>
                            </div>
                        )}
                        {Boolean(task.questionPrompt?.trim()) && (
                            <div className="rounded-xl bg-neutral-50/50 p-4">
                                <Markdown>{task.questionPrompt}</Markdown>
                            </div>
                        )}
                        <InterfaceRendererView
                            interfaceType={task.interfaceType}
                            payload={task.interfacePayload}
                            mode="preview"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskSummaryCard;