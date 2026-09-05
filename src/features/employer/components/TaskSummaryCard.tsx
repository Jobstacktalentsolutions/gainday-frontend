import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TaskTypeBadge from "./TaskTypeBadge";
import { z } from "zod";
import { simulationTaskSchema } from "../schemas/jobPosting";

type SimulationTask = z.infer<typeof simulationTaskSchema>;


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
                <TaskTypeBadge type={task.type} />
            </div>

            <p className="text-base font-medium text-neutral-950">{task.title}</p>

            {task.scenario && (
                <div className="whitespace-pre-wrap rounded-xl bg-neutral-50/50 p-4 text-sm text-neutral-700">
                    {task.scenario}
                </div>
            )}

            <div className="prose prose-sm max-w-none rounded-xl bg-neutral-50/50 p-4 text-neutral-900 prose-p:my-2 prose-ul:my-2">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{task.taskPrompt}</ReactMarkdown>
            </div>


        </div>
    );
};

export default TaskSummaryCard;