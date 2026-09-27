import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CloudUpload, Timer } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type AxiosError } from "axios";

import { ActionButton } from "@/components/ui/ActionButton";
import AppLoader from "@/components/ui/AppLoader";
import { useProtectedRoute } from "@/features/auth/hooks/useProtectedRoute";
import type { SimulationTask } from "@/features/simulation-tasks/types";
import { useJobDetails } from "../hooks/useJobDetails";
import { useJobSimulation } from "../hooks/useJobSimulation";
import { useStartSubmission, useSubmitSimulation } from "../hooks/useSubmission";
import { useSimulationRunStore, type TaskAnswer } from "../store/useSimulationRunStore";
import { useSimulationTimer } from "../hooks/useSimulationTimer";
import { useConnectionMonitor } from "../hooks/useConnectionMonitor";
import { useAutosaveAnswer } from "../hooks/useAutosaveAnswer";
import { useTabVisibilityGuard } from "../hooks/useTabVisibilityGuard";
import { useSimulationIntegrityStore } from "../hooks/useSimulationIntegrityStore";
import { TaskObjectiveOptions } from "../components/TaskObjectiveOptions";
import { TaskResponseInput } from "../components/TaskResponseInput";
import { TimeWarningBanner } from "../components/TimeWarningBanner";
import { ConnectionBanner } from "../components/ConnectionBanner";
import { SimulationCompleteModal } from "../components/SimulationCompleteModal";
import type { CandidateAnswer } from "../types/submission";

// The backend stores one free-text field per task (CandidateAnswer.responseBody — see
// submissions.schema.ts), so a task's selected option and its written response are
// collapsed into a single string here before submit.
function buildResponseBody(task: SimulationTask, answer: TaskAnswer): string {
    const parts: string[] = [];

    if (task.objectiveComponent != null) {
        const options = (task.objectiveComponent as { options?: string[] }).options;
        if (Array.isArray(options) && answer.selectedOptionIndex !== null) {
            const letter = String.fromCharCode(65 + answer.selectedOptionIndex);
            parts.push(`Selected option ${letter}: ${options[answer.selectedOptionIndex]}`);
        }
    }

    if (answer.textResponse.trim()) {
        parts.push(answer.textResponse.trim());
    }

    return parts.join("\n\n");
}

export default function TaskRunner() {
    const { jobId } = useParams<{ jobId: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const { isAuthorized, isLoadingProfile } = useProtectedRoute({
        requiredRole: "JOB_SEEKER",
        redirectTo: `/candidate/signin?redirect=${encodeURIComponent(location.pathname)}`,
    });

    const { job, isLoading: isJobLoading } = useJobDetails(jobId);
    const simulationQuery = useJobSimulation(job);
    const simulation = simulationQuery.data;

    const runStore = useSimulationRunStore();
    const addFlag = useSimulationIntegrityStore((state) => state.addFlag);
    const { scheduleSave, isSaving } = useAutosaveAnswer();
    const connection = useConnectionMonitor();

    const startSubmission = useStartSubmission();
    const submitSimulation = useSubmitSimulation();
    // Guards against StrictMode's double-effect-invoke and re-renders firing a second
    // POST — the backend creates a new Submission row on every call, it isn't idempotent.
    const hasRequestedSubmissionRef = useRef(false);
    // Guards the last-task button and the timer-expiry effect from both firing submit.
    const hasFinalizedRef = useRef(false);

    const { arm } = useTabVisibilityGuard({
        onViolation: (reason) => addFlag(`task-${runStore.currentTaskIndex}-${reason}`),
    });
    useEffect(() => {
        arm(); // arm after mount — calling arm() during render triggers setStatus → infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (job && simulation) runStore.startRun(job.id, simulation.id, simulation.timeLimitMinutes);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [job?.id, simulation?.id]);

    // Creates the Submission row for this run once job + simulation are known. Skipped
    // once the store already has a submissionId (a resumed/persisted run).
    useEffect(() => {
        if (!job || !simulation || runStore.submissionId || hasRequestedSubmissionRef.current) return;
        hasRequestedSubmissionRef.current = true;
        startSubmission.mutate(
            { jobId: job.id, simulationId: simulation.id },
            {
                onSuccess: (submission) => runStore.setSubmissionId(submission.id),
                onError: () => {
                    hasRequestedSubmissionRef.current = false;
                },
            },
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [job?.id, simulation?.id, runStore.submissionId]);

    const timer = useSimulationTimer(runStore.endTimestamp);

    function finalizeSubmission(currentTaskId: string) {
        if (hasFinalizedRef.current || !simulation) return;
        hasFinalizedRef.current = true;
        runStore.markComplete(currentTaskId);

        if (!runStore.submissionId) return; // nothing to submit against — surfaced in the modal below
        const answers: CandidateAnswer[] = simulation.tasks.map((task) => ({
            taskId: task.id,
            responseBody: buildResponseBody(task, runStore.answers[task.id] ?? { selectedOptionIndex: null, textResponse: "" }),
            timeSpentSeconds: runStore.taskTimeSpentSeconds[task.id] ?? 0,
        }));
        submitSimulation.mutate({ submissionId: runStore.submissionId, answers });
    }

    useEffect(() => {
        if (timer.isExpired && !runStore.isComplete && simulation) {
            const task = simulation.tasks[runStore.currentTaskIndex];
            finalizeSubmission(task.id);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timer.isExpired, runStore.isComplete, simulation]);

    // Keyed by which status was dismissed, not a plain boolean — "lost" and "restored" are
    // distinct values, so a fresh drop after a dismissed "restored" banner compares unequal
    // and shows again automatically. No effect/ref needed to "reset" anything.
    const [dismissedConnectionStatus, setDismissedConnectionStatus] = useState<typeof connection.status | null>(null);

    if (isLoadingProfile || !isAuthorized) {
        return <AppLoader />;
    }

    if (isJobLoading || (job && simulationQuery.isLoading)) {
        return <AppLoader />;
    }

    if (!job) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 text-center text-neutral-700">
                <p className="text-lg">Job not found.</p>
                <ActionButton variant="outline" onClick={() => navigate("/job-board")}>
                    Back to job board
                </ActionButton>
            </div>
        );
    }

    if (!simulation) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 text-center text-neutral-700">
                <p className="text-lg">This job doesn't have a simulation ready yet.</p>
                <ActionButton variant="outline" onClick={() => navigate(`/job-board/${job.id}`)}>
                    Back to job details
                </ActionButton>
            </div>
        );
    }

    const task = simulation.tasks[runStore.currentTaskIndex];
    const answer = runStore.answers[task.id] ?? { selectedOptionIndex: null, textResponse: "" };
    const isLastTask = runStore.currentTaskIndex === simulation.tasks.length - 1;

    function updateAnswer(patch: Partial<typeof answer>) {
        runStore.setAnswer(task.id, patch);
        scheduleSave({
            taskId: task.id,
            selectedOptionIndex: patch.selectedOptionIndex ?? answer.selectedOptionIndex,
            textResponse: patch.textResponse ?? answer.textResponse,
        });
    }

    function handleNext() {
        if (isLastTask) {
            finalizeSubmission(task.id);
            return;
        }
        runStore.advanceTask(task.id);
    }

    if (runStore.isComplete) {
        const submitFailed = submitSimulation.isError;
        return (
            <SimulationCompleteModal
                timeLimitMinutes={simulation.timeLimitMinutes}
                submitStatus={submitFailed ? "error" : submitSimulation.isPending ? "pending" : "done"}
                onRetry={
                    submitFailed && runStore.submissionId
                        ? () => {
                            const answers: CandidateAnswer[] = simulation.tasks.map((t) => ({
                                taskId: t.id,
                                responseBody: buildResponseBody(t, runStore.answers[t.id] ?? { selectedOptionIndex: null, textResponse: "" }),
                                timeSpentSeconds: runStore.taskTimeSpentSeconds[t.id] ?? 0,
                            }));
                            submitSimulation.mutate({ submissionId: runStore.submissionId!, answers });
                        }
                        : undefined
                }
            />
        );
    }

    const progressPercent = ((runStore.currentTaskIndex + 1) / simulation.tasks.length) * 100;
    const submitError = submitSimulation.isError
        ? (submitSimulation.error as AxiosError<{ message?: string }>)?.response?.data?.message
        ?? "Couldn't submit your simulation. Check your connection and try again."
        : null;

    return (
        <div className="min-h-screen w-full bg-neutral-50">
            {timer.isWarning && <TimeWarningBanner />}
            {!timer.isWarning && connection.status !== "online" && connection.status !== dismissedConnectionStatus && (
                <ConnectionBanner
                    status={connection.status as "lost" | "restored"}
                    onDismiss={() => setDismissedConnectionStatus(connection.status)}
                />
            )}

            {/* Simulation header — sits at the very top, 117px tall */}
            <div className="fixed left-0 top-0 z-10 flex h-29.25 w-full items-center justify-between border-b-[0.5px] border-neutral-300 bg-white/10 px-30 py-5 backdrop-blur-[100px]">
                <div className="flex w-50.5 flex-col gap-0.5">
                    <p className="text-[16px] text-primary-950">
                        Task {runStore.currentTaskIndex + 1} of {simulation.tasks.length}
                    </p>
                    <div className="h-2 w-full rounded-lg bg-[#d4d5d8]">
                        <div className="h-2 rounded bg-primary-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <p className="text-[28px] leading-[1.2] text-neutral-950">{job.title}</p>
                    <p className="text-[16px] text-neutral-400">{job.employer.companyName}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[16px] text-neutral-400">
                        <CloudUpload className="size-6" />
                        {isSaving ? "Saving..." : "Autosaved"}
                    </div>
                    <div
                        className={`flex h-13 items-center gap-2 rounded px-3 py-2 ${timer.isWarning ? "bg-error-500" : "bg-primary-950"
                            }`}
                    >
                        <Timer className="size-6 text-neutral-50" />
                        <span className="text-[32px] leading-9.5 tracking-[-0.32px] text-neutral-50">{timer.formatted}</span>
                    </div>
                </div>
            </div>
            <main className="mx-auto flex w-full max-w-300 flex-col items-center px-5 pb-20 pt-34.25">
                <div className="flex w-full max-w-246.5 flex-col gap-10 rounded-3xl bg-white p-10 shadow-[0px_4px_10px_rgba(16,24,40,0.05)]">
                    <div className="flex w-full items-center justify-between">
                        <p className="text-[16px] text-primary-500">Task • {task.category}</p>
                        {/*previously no provisions for weight*/}
                        <span className="rounded-full border border-secondary-500 bg-warning-50 px-4 py-1 text-[16px] text-secondary-500">
                            Weight: —
                        </span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <h1 className="text-[40px] leading-12 tracking-[-0.4px] text-primary-950">{task.title}</h1>
                        <div className="prose prose-sm max-w-none text-neutral-700 prose-p:my-1">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{task.scenarioDescription}</ReactMarkdown>
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-6">
                        <div className="rounded-xl border-l-[3px] border-primary-500 bg-primary-50 p-4">
                            <p className="mb-2 text-[10px] text-primary-500">SCENARIO</p>
                            <div className="prose prose-sm max-w-none text-neutral-700 prose-p:my-1">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{task.scenarioDescription}</ReactMarkdown>
                            </div>
                        </div>
                        <TaskObjectiveOptions
                            task={task}
                            selectedIndex={answer.selectedOptionIndex}
                            onSelect={(index) => updateAnswer({ selectedOptionIndex: index })}
                        />

                        <TaskResponseInput
                            task={task}
                            value={answer.textResponse}
                            onChange={(value) => updateAnswer({ textResponse: value })}
                        />
                    </div>

                    {submitError && (
                        <p role="alert" className="text-center text-sm text-error-600">
                            {submitError}
                        </p>
                    )}

                    <div className="h-px w-full bg-neutral-200" />

                    <div className="flex w-full items-center justify-between">
                        {/* Previous Task is permanently disabled — forward-only, per your call */}
                        <ActionButton variant="outline" size="md" disabled className="opacity-70">
                            Previous Task
                        </ActionButton>
                        <ActionButton
                            variant="primary"
                            size="md"
                            onClick={handleNext}
                            disabled={isLastTask && submitSimulation.isPending}
                        >
                            {isLastTask
                                ? submitSimulation.isPending
                                    ? "Submitting..."
                                    : "Submit Simulation"
                                : "Next Task"}
                        </ActionButton>
                    </div>
                </div>
            </main>
        </div>
    );
}
