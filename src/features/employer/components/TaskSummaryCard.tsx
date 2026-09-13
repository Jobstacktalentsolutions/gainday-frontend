import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TaskTypeBadge from "./TaskTypeBadge";
import { InterfaceRendererView } from "@/features/simulation-tasks/interfaceRenderers/registry";
import ComponentSummary from "@/features/simulation-tasks/ComponentSummary";
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
                <TaskTypeBadge taskType={task.taskType} />
            </div>

            <p className="text-base font-medium text-neutral-950">{task.title}</p>

            {task.scenarioDescription && (
                <div className="prose prose-sm max-w-none rounded-xl bg-neutral-50/50 p-4 text-neutral-700 prose-p:my-2 prose-ul:my-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {task.scenarioDescription}
                    </ReactMarkdown>
                </div>
            )}

            <div className="prose prose-sm max-w-none rounded-xl bg-neutral-50/50 p-4 text-neutral-900 prose-p:my-2 prose-ul:my-2">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{task.questionPrompt}</ReactMarkdown>
            </div>

            <InterfaceRendererView
                interfaceType={task.interfaceType}
                payload={task.interfacePayload}
                mode="preview"
            />

            <ComponentSummary label="Grading criteria" data={task.objectiveComponent} />
            <ComponentSummary label="Prompt framing" data={task.openEndedComponent} />
        </div>
    );
};

export default TaskSummaryCard;
