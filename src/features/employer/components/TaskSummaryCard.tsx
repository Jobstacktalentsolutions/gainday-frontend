import Markdown from "@/components/ui/Markdown";
import TaskTypeBadge from "./TaskTypeBadge";
import { InterfaceRendererView } from "@/features/simulation-tasks/interfaceRenderers/registry";
import type { SimulationTask } from "@/features/simulation-tasks/types";

interface TaskSummaryCardProps {
    index: number;
    task: SimulationTask;
}

const TaskSummaryCard = ({ index, task }: TaskSummaryCardProps) => {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center gap-2.5">
                <p className="text-sm font-bold uppercase tracking-wide text-neutral-900">
                    Task {index + 1}
                </p>
                <TaskTypeBadge taskType={task.taskType} interfaceType={task.interfaceType} />
            </div>

            <p className="text-base font-medium text-neutral-950">{task.title}</p>

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
    );
};

export default TaskSummaryCard;
