import { useState, useRef, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { StepSecondaryButton, StepContinueButton } from "@/components/ui/StepNavigationButtons";
import TaskCard from "../components/TaskCard";
import TaskCardSkeleton from "../components/TaskCardSkeleton";
import RegenerationFailureModal from "../components/RegenerationFailureModal";
import RegenerateGuidanceModal from "../components/RegenerateGuidanceModal";
import { simulationBuilderSchema, type JobPostingFormValues } from "../schemas/jobPosting";
import TaskGenerationModal from "../components/TaskGenerationModal";
import { useJobSimulation } from "../hooks/useJobSimulation";
import { useRegenerateTask } from "../hooks/useRegenerateTask";
import { useRegenerateAllTasks } from "../hooks/useRegenerateAllTasks";
import { useUpdateSimulationTasks } from "../hooks/useUpdateSimulationTasks";
import type { SimulationTask } from "@/features/simulation-tasks/types";

const EASE = [0.16, 1, 0.3, 1] as const;

type FailedTaskInfo =
    | { source: "regenerate"; id: string; index: number }
    | { source: "add" }
    | { source: "regenerate-all" };

interface JobPostingOutletContext {
    jobId: string | null;
}

const SimulationBuilder = () => {
    const navigate = useNavigate();
    const { jobId } = useOutletContext<JobPostingOutletContext>();
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
    const [regeneratingTaskId, setRegeneratingTaskId] = useState<string | null>(null);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [failedTask, setFailedTask] = useState<FailedTaskInfo | null>(null);
    const [guidanceTarget, setGuidanceTarget] = useState<{ index: number; taskId: string } | null>(null);
    const [isContinuing, setIsContinuing] = useState(false);
    const [isRegeneratingAll, setIsRegeneratingAll] = useState(false);
    const hasLoadedTasksRef = useRef(false);

    const {
        control,
        trigger,
        watch,
    } = useFormContext<JobPostingFormValues>();

    const formValues = watch();
    const isStepValid = simulationBuilderSchema.safeParse(formValues).success;

    // keyName: "fieldKey" — react-hook-form's useFieldArray otherwise silently overwrites our
    // real SimulationTask.id with its own tracking id on every append/replace/update, which would
    // corrupt task identity (the id ties back to question_bank for grading) the moment it's saved.
    const { fields, append, remove, replace, update } = useFieldArray({
        control,
        name: "tasks",
        keyName: "fieldKey",
    });

    const { data: jobSimulation, isLoading: isLoadingSimulation } = useJobSimulation(jobId);
    const { regenerate } = useRegenerateTask();
    const { regenerateAll } = useRegenerateAllTasks();
    const updateSimulationTasks = useUpdateSimulationTasks();

    // True while the INITIAL full-graph generation (queued via BullMQ from Job Details) is still
    // running, or while a manual "Regenerate all" SSE stream is in flight. The two are otherwise
    // unrelated: "Regenerate all" never touches job.status or the queue (see handleRegenerate).
    const isWholeScenarioGenerating = jobSimulation?.status === "GENERATING" || isRegeneratingAll;

    // Seed the field array from the real generated tasks the first time they arrive — never
    // again after that, so it doesn't clobber the employer's own edits on subsequent polls.
    useEffect(() => {
        if (!hasLoadedTasksRef.current && jobSimulation?.simulation?.tasks?.length) {
            replace(jobSimulation.simulation.tasks);
            hasLoadedTasksRef.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobSimulation?.simulation?.tasks]);

    // Keeps the expanded task valid whenever the field array changes shape: falls back to the
    // first task if the currently-expanded one no longer exists (initial load, "Regenerate all"
    // wiping the array, or the expanded task being removed) — otherwise leaves the user's choice
    // alone. `update()` (single-task regenerate) preserves the original fieldKey, so this
    // correctly does NOT re-expand/collapse anything during that flow.
    useEffect(() => {
        if (fields.length === 0) {
            if (expandedTaskId !== null) {
                // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above
                setExpandedTaskId(null);
            }
            return;
        }
        const stillExists = fields.some((f) => f.fieldKey === expandedTaskId);
        if (!stillExists) {
            setExpandedTaskId(fields[0].fieldKey);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields]);

    // Auto-expand the newly appended task ("Add Task") — runs after the effect above, so it wins
    // when both fire in the same pass (a brand-new task always exists, so the guard above no-ops).
    const prevFieldsLengthRef = useRef(fields.length);
    useEffect(() => {
        if (fields.length > prevFieldsLengthRef.current) {
            const latest = fields[fields.length - 1];
            if (latest) {
                // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above
                setExpandedTaskId(latest.fieldKey);
            }
        }
        prevFieldsLengthRef.current = fields.length;
    }, [fields]);

    const runRegeneration = async (
        guidance: string | undefined,
        existingTask: SimulationTask | undefined,
        onSuccess: (task: SimulationTask) => void,
        onFailure: () => void,
    ) => {
        if (!jobId) return;
        try {
            const task = await regenerate(jobId, guidance, existingTask);
            onSuccess(task);
        } catch {
            onFailure();
        }
    };

    // Adds a new task via the real generation pipeline (no guidance prompt for "Add Task" —
    // guidance is only offered when regenerating an existing task, per the employer flow).
    const handleAddTask = () => {
        setIsAddingTask(true);
        setFailedTask(null);
        void runRegeneration(
            undefined,
            undefined,
            (task) => {
                append(task);
                setIsAddingTask(false);
            },
            () => {
                setIsAddingTask(false);
                setFailedTask({ source: "add" });
            },
        );
    };

    // Streams a fresh regeneration of every current task slot over the same lightweight SSE path
    // as a single-task regenerate — no BullMQ queue, no re-run of extraction/critic, since
    // job_extractions already exists by the time this button is reachable. Tasks fill in
    // progressively as each one streams back rather than appearing all at once after a wait.
    const handleRegenerate = async () => {
        if (!jobId || fields.length === 0) return;
        const count = fields.length;
        setIsRegeneratingAll(true);
        setFailedTask(null);
        replace([]);
        try {
            await regenerateAll(jobId, count, { onTask: (task) => append(task) });
        } catch {
            setFailedTask({ source: "regenerate-all" });
        } finally {
            setIsRegeneratingAll(false);
        }
    };

    // Opens the optional-guidance modal, then regenerates a single task in place on submit.
    const handleRegenerateTask = (index: number, taskId: string) => {
        setGuidanceTarget({ index, taskId });
    };

    const handleGuidanceSubmit = (guidance?: string) => {
        if (!guidanceTarget) return;
        const { index, taskId } = guidanceTarget;
        setGuidanceTarget(null);
        setRegeneratingTaskId(taskId);
        setFailedTask(null);
        // With guidance, send the task as it exists now so the backend EDITS it per the
        // instruction instead of writing an unrelated new one (see useRegenerateTask). Without
        // guidance, omit it entirely — a plain "Regenerate" with no instruction still means
        // "surprise me with something new," not "make no change."
        const existingTask = guidance ? (watch(`tasks.${index}`) as SimulationTask) : undefined;
        void runRegeneration(
            guidance,
            existingTask,
            (task) => {
                update(index, { ...task, id: taskId });
                setRegeneratingTaskId(null);
            },
            () => {
                setRegeneratingTaskId(null);
                setFailedTask({ id: taskId, index, source: "regenerate" });
            },
        );
    };

    // Handles retry from the failure modal for add-task, single-task, and whole-scenario flows
    const handleFailureRetry = () => {
        if (!failedTask) return;
        if (failedTask.source === "add") {
            setFailedTask(null);
            handleAddTask();
        } else if (failedTask.source === "regenerate-all") {
            setFailedTask(null);
            void handleRegenerate();
        } else {
            const { index, id } = failedTask;
            setFailedTask(null);
            handleRegenerateTask(index, id);
        }
    };

    const handleFailureDismiss = () => {
        setFailedTask(null);
    };

    const handleContinue = async () => {
        const isValid = await trigger(["tasks"]);
        if (!isValid) return;

        const simulationId = jobSimulation?.simulation?.id;
        if (simulationId) {
            setIsContinuing(true);
            try {
                await updateSimulationTasks.mutateAsync({
                    simulationId,
                    tasks: watch("tasks"),
                });
            } finally {
                setIsContinuing(false);
            }
        }

        navigate("/employer/jobs/new/review");
    };

    const isAnyTaskBusy = Boolean(regeneratingTaskId) || isAddingTask || isRegeneratingAll;

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
                        disabled={isWholeScenarioGenerating}
                        className="flex h-10 self-start items-center justify-center gap-2 rounded-xl border border-neutral-300 px-6 py-2 text-base text-neutral-950 transition-all hover:bg-neutral-50 disabled:opacity-60"
                    >
                        Regenerate
                        <RefreshCw className={isWholeScenarioGenerating ? "size-4 animate-spin" : "size-4"} aria-hidden="true" />
                    </button>
                </div>

                <div className="flex flex-col gap-5">
                    <AnimatePresence initial={false}>
                        {fields.map((field, index) => {
                            const isThisRegenerating = regeneratingTaskId === field.id;
                            return (
                                <motion.div
                                    key={field.fieldKey}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.4, delay: index * 0.06, ease: EASE }}
                                >
                                    <AnimatePresence mode="wait" initial={false}>
                                        {isThisRegenerating ? (
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
                                                    expanded={expandedTaskId === field.fieldKey}
                                                    onToggleExpand={() =>
                                                        setExpandedTaskId((current) =>
                                                            current === field.fieldKey ? null : field.fieldKey
                                                        )
                                                    }
                                                    onRemove={() => remove(index)}
                                                    onRegenerate={() => handleRegenerateTask(index, field.id)}
                                                    regenerateDisabled={isWholeScenarioGenerating || isAnyTaskBusy}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}

                        {/* Shows generating skeleton card at the bottom while AI is generating the new task */}
                        {isAddingTask && (
                            <motion.div
                                key="adding-task-skeleton"
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.35, ease: EASE }}
                            >
                                <TaskCardSkeleton />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    type="button"
                    onClick={handleAddTask}
                    disabled={isAnyTaskBusy || isWholeScenarioGenerating}
                    className="flex h-10 w-full cursor-pointer hover:bg-[#f7f6f6] items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 px-4 text-base text-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Plus className="size-4" aria-hidden="true" />
                    {isAddingTask ? "Generating task..." : "Add Task"}
                </button>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
                <StepSecondaryButton onClick={() => navigate(-1)}>
                    Back
                </StepSecondaryButton>
                <StepContinueButton disabled={!isStepValid || isContinuing} onClick={handleContinue}>
                    {isContinuing ? "Saving..." : "Continue"}
                </StepContinueButton>
            </div>

            {/* Full-scenario generation loading modal — covers both the initial generate-from-Job-Details
                wait and an explicit "Regenerate" re-run. No cancel option: this is a real async
                pipeline run on the backend with no cancel endpoint, so there's nothing to abort. */}
            <TaskGenerationModal open={isWholeScenarioGenerating || isLoadingSimulation} />

            {/* Optional-guidance prompt before regenerating a single task */}
            <RegenerateGuidanceModal
                open={Boolean(guidanceTarget)}
                onCancel={() => setGuidanceTarget(null)}
                onSubmit={handleGuidanceSubmit}
            />

            {/* Task generation / regeneration failure modal */}
            <RegenerationFailureModal
                open={Boolean(failedTask)}
                taskLabel={
                    failedTask?.source === "add"
                        ? "the new task"
                        : failedTask?.source === "regenerate-all"
                            ? "the tasks"
                            : failedTask
                                ? `Task ${failedTask.index + 1}`
                                : undefined
                }
                isRetrying={isAnyTaskBusy}
                onDismiss={handleFailureDismiss}
                onRetry={handleFailureRetry}
            />
        </div>
    );
};

export default SimulationBuilder;
