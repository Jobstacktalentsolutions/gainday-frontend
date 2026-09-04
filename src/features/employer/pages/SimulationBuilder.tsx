import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { FormTextarea } from "@/components/form/FormTextarea";
import { StepSecondaryButton, StepContinueButton } from "@/components/ui/StepNavigationButtons";
import TaskCard from "../components/TaskCard";
import TaskCardSkeleton from "../components/TaskCardSkeleton";
import RegenerationFailureModal from "../components/RegenerationFailureModal";
import { simulationBuilderSchema, type JobPostingFormValues } from "../schemas/jobPosting";
import TaskGenerationModal from "../components/TaskGenerationModal";
import { MOCK_SCENARIO_INTRO, MOCK_TASKS } from "../mocks/jobPostingDefaults";

const EASE = [0.16, 1, 0.3, 1] as const;

const SimulationBuilder = () => {
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
    const [regeneratingTaskId, setRegeneratingTaskId] = useState<string | null>(null);
    const [addingTaskId, setAddingTaskId] = useState<string | null>(null);
    const [failedTask, setFailedTask] = useState<{ id: string; index: number; source: "regenerate" | "add" } | null>(null);
    const abortTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const taskRegenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const addTaskTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const {
        register,
        control,
        setValue,
        trigger,
        watch,
        formState: { errors },
    } = useFormContext<JobPostingFormValues>();

    const formValues = watch();
    const isStepValid = simulationBuilderSchema.safeParse(formValues).success;

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "tasks",
    });

    // Expand the first task by default once tasks exist
    useEffect(() => {
        if (!expandedTaskId && fields.length > 0) {
            setExpandedTaskId(fields[0].id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields.length]);

    useEffect(() => {
        return () => {
            if (abortTimerRef.current) clearTimeout(abortTimerRef.current);
            if (taskRegenTimerRef.current) clearTimeout(taskRegenTimerRef.current);
            if (addTaskTimerRef.current) clearTimeout(addTaskTimerRef.current);
        };
    }, []);

    // Adds a new task via AI generation (simulated)
    const handleAddTask = () => {
        const newId = crypto.randomUUID();
        const newIndex = fields.length;

        // Append a placeholder so a skeleton card appears in the list
        append({
            id: newId,
            type: "written",
            title: "",
            taskPrompt: "",
            scenario: "",
            capabilities: [],
            scores: [],
        });
        setAddingTaskId(newId);
        setFailedTask(null);

        // TODO: swap for the real AI generate-task API call.
        // Simulated here with an occasional failure so the failure modal has something to show.
        addTaskTimerRef.current = setTimeout(() => {
            const succeeded = Math.random() > 0.25;
            if (succeeded) {
                const replacement = MOCK_TASKS[newIndex % MOCK_TASKS.length];
                setValue(
                    `tasks.${newIndex}`,
                    { ...replacement, id: newId },
                    { shouldValidate: true }
                );
                setAddingTaskId(null);
                setExpandedTaskId(newId);
            } else {
                setAddingTaskId(null);
                setFailedTask({ id: newId, index: newIndex, source: "add" });
            }
        }, 2200);
    };

    // Regenerates the whole scenario + all tasks
    const handleRegenerate = () => {
        setIsGenerating(true);
        abortTimerRef.current = setTimeout(() => {
            setValue("scenarioIntro", MOCK_SCENARIO_INTRO, { shouldValidate: true });
            replace(MOCK_TASKS);
            setIsGenerating(false);
        }, 2800);
    };

    const handleCancelGeneration = () => {
        if (abortTimerRef.current) {
            clearTimeout(abortTimerRef.current);
            abortTimerRef.current = null;
        }
        setIsGenerating(false);
    };

    // Regenerates a single task in place
    const handleRegenerateTask = (index: number, taskId: string) => {
        setRegeneratingTaskId(taskId);
        setFailedTask(null);

        // TODO: swap for the real regenerate-single-task API call.
        // Simulated here with an occasional failure so the failure modal has something to show.
        taskRegenTimerRef.current = setTimeout(() => {
            const succeeded = Math.random() > 0.25;
            if (succeeded) {
                const replacement = MOCK_TASKS[index % MOCK_TASKS.length];
                setValue(
                    `tasks.${index}`,
                    { ...replacement, id: taskId },
                    { shouldValidate: true }
                );
                setRegeneratingTaskId(null);
            } else {
                setRegeneratingTaskId(null);
                setFailedTask({ id: taskId, index, source: "regenerate" });
            }
        }, 1800);
    };

    // Handles retry from the failure modal for both regeneration and add-task flows
    const handleFailureRetry = () => {
        if (!failedTask) return;
        if (failedTask.source === "add") {
            // Re-trigger AI generation for the placeholder task
            setAddingTaskId(failedTask.id);
            const capturedFailedTask = { ...failedTask };
            setFailedTask(null);

            addTaskTimerRef.current = setTimeout(() => {
                const succeeded = Math.random() > 0.25;
                if (succeeded) {
                    const replacement = MOCK_TASKS[capturedFailedTask.index % MOCK_TASKS.length];
                    setValue(
                        `tasks.${capturedFailedTask.index}`,
                        { ...replacement, id: capturedFailedTask.id },
                        { shouldValidate: true }
                    );
                    setAddingTaskId(null);
                    setExpandedTaskId(capturedFailedTask.id);
                } else {
                    setAddingTaskId(null);
                    setFailedTask({ ...capturedFailedTask });
                }
            }, 2200);
        } else {
            handleRegenerateTask(failedTask.index, failedTask.id);
        }
    };

    const handleFailureDismiss = () => {
        // If an add-task generation failed, remove the empty placeholder
        if (failedTask?.source === "add") {
            const idx = fields.findIndex((f) => f.id === failedTask.id);
            if (idx !== -1) remove(idx);
        }
        setFailedTask(null);
    };

    const handleContinue = async () => {
        const isValid = await trigger(["scenarioIntro", "tasks"]);
        if (isValid) navigate("/employer/jobs/new/review");
    };

    const isAnyTaskBusy = Boolean(regeneratingTaskId) || Boolean(addingTaskId);

    return (
        <div className="flex flex-col gap-12">
            {/* Header — centered */}
            <div className="flex flex-col lg:items-center gap-2 text-left lg:text-center">
                <h1 className="text-3xl font-bold text-black lg:text-4xl">Challenge generation</h1>
                <p className="max-w-lg text-base text-neutral-500">
                    A realistic work simulation assessment built from the capabilities you approved.
                    Estimated completion time: 20 minutes.
                </p>
            </div>

            {/* Challenge content */}
            <div className="flex w-full flex-col gap-10 rounded-3xl border border-dashed shadow-sm bg-white/70 px-3 py-10 text-center">
                <div className="flex flex-col gap-3 text-left">
                    <p className="text-sm text-primary-500">CHALLENGE GENERATION</p>
                    <p className="text-base text-neutral-950">
                        A realistic work simulation assessment built from the capabilities you approved.
                        Estimated completion time: 20 minutes.
                    </p>
                    <button
                        type="button"
                        onClick={handleRegenerate}
                        disabled={isGenerating}
                        className="flex h-10 self-start items-center justify-center gap-2 rounded-xl border border-neutral-300 px-6 py-2 text-base text-neutral-950 transition-all hover:bg-neutral-50 disabled:opacity-60"
                    >
                        Regenerate
                        <RefreshCw className={isGenerating ? "size-4 animate-spin" : "size-4"} aria-hidden="true" />
                    </button>
                </div>

                <FormTextarea
                    label="Scenario intro the candidate reads first"
                    rows={10}
                    error={errors.scenarioIntro?.message}
                    {...register("scenarioIntro")}
                />

                <div className="flex flex-col gap-5">
                    <AnimatePresence initial={false}>
                        {fields.map((field, index) => {
                            const isThisRegenerating = regeneratingTaskId === field.id;
                            const isThisAdding = addingTaskId === field.id;
                            const showSkeleton = isThisRegenerating || isThisAdding;
                            return (
                                <motion.div
                                    key={field.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.4, delay: index * 0.06, ease: EASE }}
                                >
                                    <AnimatePresence mode="wait" initial={false}>
                                        {showSkeleton ? (
                                            <motion.div
                                                key="skeleton"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <TaskCardSkeleton />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="card"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <TaskCard
                                                    index={index}
                                                    type={field.type}
                                                    expanded={expandedTaskId === field.id}
                                                    onToggleExpand={() =>
                                                        setExpandedTaskId((current) =>
                                                            current === field.id ? null : field.id
                                                        )
                                                    }
                                                    onRemove={() => remove(index)}
                                                    onRegenerate={() => handleRegenerateTask(index, field.id)}
                                                    regenerateDisabled={isGenerating || isAnyTaskBusy}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                <button
                    type="button"
                    onClick={handleAddTask}
                    disabled={isAnyTaskBusy || isGenerating}
                    className="flex h-10 w-full cursor-pointer hover:bg-[#f7f6f6] items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 px-4 text-base text-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Plus className="size-4" aria-hidden="true" />
                    Add Task
                </button>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
                <StepSecondaryButton onClick={() => navigate(-1)}>
                    Back
                </StepSecondaryButton>
                <StepContinueButton disabled={!isStepValid} onClick={handleContinue}>
                    Continue
                </StepContinueButton>
            </div>

            {/* Full-scenario regeneration loading modal */}
            <TaskGenerationModal
                open={isGenerating}
                onCancel={handleCancelGeneration}
            />

            {/* Task generation / regeneration failure modal */}
            <RegenerationFailureModal
                open={Boolean(failedTask)}
                taskLabel={failedTask ? (failedTask.source === "add" ? "the new task" : `Task ${failedTask.index + 1}`) : undefined}
                isRetrying={isAnyTaskBusy}
                onDismiss={handleFailureDismiss}
                onRetry={handleFailureRetry}
            />
        </div>
    )
}

export default SimulationBuilder;