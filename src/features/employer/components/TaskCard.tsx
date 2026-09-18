
import { Trash2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { JobFormInput } from "@/components/form/JobFormInput";
import TaskTypeBadge from "./TaskTypeBadge";
import TaskPromptEditor from "./TaskPromptEditor";
import { InterfaceRendererView } from "@/features/simulation-tasks/interfaceRenderers/registry";
import ComponentSummary from "@/features/simulation-tasks/ComponentSummary";
import { cn } from "@/lib/utils";
import type { JobPostingFormValues } from "../schemas/jobPosting";

interface TaskCardProps {
    index: number;
    expanded: boolean;
    onToggleExpand: () => void;
    onRemove: () => void;
    onRegenerate: () => void;
    regenerateDisabled?: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const TaskCard = ({
    index, expanded, onToggleExpand, onRemove, onRegenerate, regenerateDisabled
}: TaskCardProps) => {
    const {
        register,
        control,
        watch,
        formState: { errors },
    } = useFormContext<JobPostingFormValues>();

    const taskType = watch(`tasks.${index}.taskType` as const);
    const interfaceType = watch(`tasks.${index}.interfaceType` as const);
    const interfacePayload = watch(`tasks.${index}.interfacePayload` as const);
    const objectiveComponent = watch(`tasks.${index}.objectiveComponent` as const);
    const openEndedComponent = watch(`tasks.${index}.openEndedComponent` as const);
    const businessProblemDerived = watch(`tasks.${index}.businessProblemDerived` as const);
    const questionPrompt = watch(`tasks.${index}.questionPrompt` as const);
    const taskErrors = errors.tasks?.[index];

    const promptPreview = questionPrompt
        ?.replace(/[#*_`>]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    return (
        <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <input type="hidden" {...register(`tasks.${index}.id` as const)} />
            <div className="flex items-center justify-between border-b border-neutral-100 p-5">
                <div className="flex items-center gap-3">
                    <p className="text-sm font-bold uppercase tracking-wide text-neutral-900">
                        TASK {index + 1}
                    </p>
                    <TaskTypeBadge taskType={taskType} interfaceType={interfaceType} />
                </div>

                {/* Desktop: action buttons in header */}
                <div className="hidden items-center gap-2 lg:flex">
                    <motion.button
                        type="button"
                        onClick={onRegenerate}
                        disabled={regenerateDisabled}
                        whileTap={{ scale: regenerateDisabled ? 1 : 0.97 }}
                        className={cn(
                            "flex h-8 cursor-pointer items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-700 active:bg-primary-700 px-3 text-sm font-medium text-white shadow-sm transition-colors duration-200",
                            "disabled:cursor-not-allowed disabled:opacity-60"
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
                            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                        >
                            <ChevronUp className="size-4" aria-hidden="true" />
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onRemove}
                        className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-sm text-neutral-400 transition-colors hover:bg-error-50 hover:text-error-500"
                    >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        Remove
                    </button>
                </div>

                {/* Mobile: collapse chevron only */}
                <div className="flex items-center lg:hidden">
                    {expanded && (
                        <button
                            type="button"
                            onClick={onToggleExpand}
                            aria-label="Collapse task details"
                            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                        >
                            <ChevronUp className="size-4" aria-hidden="true" />
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile: action buttons row below header */}
            <div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-3 lg:hidden">
                <motion.button
                    type="button"
                    onClick={onRegenerate}
                    disabled={regenerateDisabled}
                    whileTap={{ scale: regenerateDisabled ? 1 : 0.97 }}
                    className={cn(
                        "flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 active:bg-primary-700 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-200",
                        "disabled:cursor-not-allowed disabled:opacity-60"
                    )}
                >
                    <RefreshCw className="size-3.5" aria-hidden="true" />
                    Regenerate
                </motion.button>
                <button
                    type="button"
                    onClick={onRemove}
                    className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:border-error-200 hover:bg-error-50 hover:text-error-500"
                >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    Remove
                </button>
            </div>

            <div className="flex flex-col gap-5 bg-neutral-50/50 p-5">
                <JobFormInput
                    label="Title"
                    error={taskErrors?.title?.message}
                    {...register(`tasks.${index}.title` as const)}
                />

                {!expanded && promptPreview && (
                    <p className="line-clamp-2 text-left text-sm text-neutral-500">
                        {promptPreview}
                    </p>
                )}

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
                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="text-base font-medium text-neutral-800">Scenario</label>
                                <Controller
                                    control={control}
                                    name={`tasks.${index}.scenarioDescription` as const}
                                    render={({ field }) => (
                                        <TaskPromptEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={taskErrors?.scenarioDescription?.message}
                                        />
                                    )}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="text-base font-medium text-neutral-800">Task prompt</label>
                                <Controller
                                    control={control}
                                    name={`tasks.${index}.questionPrompt` as const}
                                    render={({ field }) => (
                                        <TaskPromptEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={taskErrors?.questionPrompt?.message}
                                        />
                                    )}
                                />
                            </div>

                            {/* Read-only preview of how the candidate will answer — the response-interface
                                type/shape is set by the generation pipeline, not editable at this tier. */}
                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="text-base font-medium text-neutral-800">
                                    Candidate response interface
                                </label>
                                <InterfaceRendererView
                                    interfaceType={interfaceType}
                                    payload={interfacePayload ?? {}}
                                    mode="preview"
                                />
                            </div>

                            {/* Read-only grading data — what the candidate's answer is actually scored
                                against. Not editable here: fixing flagged content is an admin action
                                (Generation Reviews), employers just need visibility into it. */}
                            <ComponentSummary label="Grading criteria" data={objectiveComponent} />
                            <ComponentSummary label="Prompt framing" data={openEndedComponent} />

                            {businessProblemDerived && (
                                <p className="flex items-center gap-1.5 text-left text-sm text-primary-600">
                                    <span className="inline-block size-1.5 rounded-full bg-primary-500" aria-hidden="true" />
                                    Built from the specific business problem you described.
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {!expanded && (
                <div className="flex justify-center bg-neutral-50/50 pb-5">
                    <button
                        type="button"
                        onClick={onToggleExpand}
                        className="flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-2 text-sm font-semibold text-primary-600 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
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
