import { Trash2 } from "lucide-react";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import TaskTypeBadge from "./TaskTypeBadge";
import type { SimulationTask } from "../schemas/jobPosting";


interface TaskCardProps {
    index: number;
    task: SimulationTask;
    onRemove: () => void;
    onChange: (field: "title" | "prompt" | "scenario", value: string) => void;
    errors?: {
        title?: string;
        prompt?: string;
        scenario?: string;
    };
}

const TaskCard = ({
    index,
    task,
    onRemove,
    onChange,
    errors
}: TaskCardProps) => {

    return (
        <div className="flex w-full flex-col gap-4 rounded-xl border border-neutral-200 px-2 py-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex flex-1 items-center gap-2.5">
                    <p>TASK {index + 1}</p>
                    <TaskTypeBadge type={task.type} />
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    className="flex items-center gap-1 text-sm text-neutral-400 hover:text-error-500"
                >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    Remove
                </button>
            </div>

            <FormInput
                label="Task title"
                hideLabel
                value={task.title}
                onChange={(e) => onChange("title", e.target.value)}
                error={errors?.title}
            />
            <FormTextarea
                label="Task prompt"
                hideLabel
                rows={4}
                value={task.taskPrompt}
                onChange={(e) => onChange("prompt", e.target.value)}
                error={errors?.prompt}
            />

            <FormTextarea
                label="Scenario context"
                hideLabel
                rows={8}
                value={task.scenario}
                onChange={(e) => onChange("scenario", e.target.value)}
                error={errors?.scenario}
            />
            {(task.capabilities.length > 0 || task.scores.length > 0) && (
                <p className="text-sm text-neutral-950">
                    Capabilities: {task.capabilities.join(", ")} · Scores: {task.scores.join(", ")}
                </p>
            )}

        </div>
    )
}

export default TaskCard;