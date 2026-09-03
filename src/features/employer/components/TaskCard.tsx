
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
        control,
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

                <div className="flex items-center gap-2">
                    <motion.button
                        type="button"
                        onClick={onRegenerate}
                        disabled={regenerateDisabled}
                        whileHover={{ scale: regenerateDisabled ? 1 : 1.03 }}
                        whileTap={{ scale: regenerateDisabled ? 1 : 0.97 }}
                        className={cn(
                            "flex h-8 items-center gap-1.5 rounded-md bg-linear-to-r from-primary-500 to-primary-700 px-3 text-sm font-medium text-white shadow-sm transition-shadow",
                            "hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                        )}
                    >
                        <RefreshCw className="size-3.5" aria-hidden="true" />
                        Regenerate
                    </motion.button>
                    {expanded && (
                        <button
                            type="button"
                            onClick={onToggleExpand}
                            aria-label="Collapse task details"
                            className="flex size-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                        >
                            <ChevronUp className="size-4" aria-hidden="true" />
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onRemove}
                        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-neutral-400 transition-colors hover:text-error-500"
                    >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        Remove
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-5 bg-neutral-50/50 p-5">
                <JobFormInput
                    label="Title"
                    error={taskErrors?.title?.message}
                    {...register(`tasks.${index}.title` as const)}
                />

                <AnimatePresence initial={false}>
                    {expanded && (
                        <motion.div
                            key="details"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: EASE }}
                            className="flex flex-col gap-5 overflow-hidden"
                        >
                            <FormTextarea
                                label="Scenario context"
                                rows={5}
                                error={taskErrors?.scenario?.message}
                                {...register(`tasks.${index}.scenario` as const)}
                            />

                            <div className="flex flex-col gap-1.5">
                                <label className="text-base font-medium text-neutral-800">Task prompt</label>
                                <Controller
                                    control={control}
                                    name={`tasks.${index}.taskPrompt` as const}
                                    render={({ field }) => (
                                        <TaskPromptEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={taskErrors?.taskPrompt?.message}
                                        />
                                    )}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {!expanded && (
                <div className="flex justify-center bg-neutral-50/50 pb-5">
                    <button
                        type="button"
                        onClick={onToggleExpand}
                        className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-2 text-sm font-semibold text-primary-600 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                    >
                        Expand Task Details
                        <ChevronDown className="size-3.5" aria-hidden="true" />
                    </button>
                </div>
            )}


        </div>
    );
};

export default TaskCard;