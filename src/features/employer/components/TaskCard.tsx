
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

const EASE = [0.16, 1, 0.3, 1] as const;

const TaskCard = ({
    index, type, expanded, onToggleExpand, onRemove, onRegenerate, regenerateDisabled
}: TaskCardProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext<JobPostingFormValues>();

    const taskErrors = errors.tasks?.[index];

    return (
        <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-100 p-5">
                <div className="flex items-center gap-3">
                    <p className="text-sm font-bold uppercase tracking-wide text-neutral-900">
                        TASK {index + 1}
                    </p>
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