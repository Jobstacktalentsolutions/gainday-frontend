
import { Trash2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { JobFormInput } from "@/components/form/JobFormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import TaskTypeBadge from "./TaskTypeBadge";
import TaskPromptEditor from "./TaskPromptEditor";
import { cn } from "@/lib/utils";
import type { JobPostingFormValues, TaskType } from "../schemas/jobPosting";

interface TaskCardProps {
    index: number;
    type: TaskType;
    expanded: boolean;
    onToggleExpand: () => void;
    onRemove: () => void;
    onRegenerate: () => void;
    regenerateDisabled?: boolean;
}

const TaskCard = ({ index, type, onRemove }: TaskCardProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext<JobPostingFormValues>();

    const taskErrors = errors.tasks?.[index];

    return (
        <div className="flex w-full flex-col gap-4 rounded-xl border border-neutral-200 px-2 py-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex flex-1 items-center gap-2.5">
                    <p className="text-sm text-neutral-950">TASK {index + 1}</p>
                    <TaskTypeBadge type={type} />
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

            <JobFormInput
                label="Task title"
                hideLabel
                error={taskErrors?.title?.message}
                {...register(`tasks.${index}.title` as const)}
            />

            <FormTextarea
                label="Task prompt"
                hideLabel
                rows={4}
                error={taskErrors?.taskPrompt?.message}
                {...register(`tasks.${index}.taskPrompt` as const)}
            />

            <FormTextarea
                label="Scenario context"
                hideLabel
                rows={8}
                error={taskErrors?.scenario?.message}
                {...register(`tasks.${index}.scenario` as const)}
            />
        </div>
    );
};

export default TaskCard;