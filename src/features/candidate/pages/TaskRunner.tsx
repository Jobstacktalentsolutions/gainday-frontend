import { useEffect, useRef, useState } from "react";
import type { AxiosError } from "axios";
import ReactMarkdown from "react-markdown";
import { MARKDOWN_PLUGINS } from "@/lib/markdown";
import { TaskQuestion } from "../components/TaskQuestion";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Timer, Clock } from "@/components/ui/icons";

import { ActionButton } from "@/components/ui/ActionButton";
import AppLoader from "@/components/ui/AppLoader";
import { useProtectedRoute } from "@/features/auth/hooks/useProtectedRoute";
import { OBJECTIVE_ANSWER_DESCRIBERS } from "../components/objectiveAnswers/registry";
import type { CandidateSimulationTask } from "../types/simulation";
import { useJobDetails } from "../hooks/useJobDetails";
import { useAppliedJobIds } from "../hooks/useAppliedJobIds";
import { useJobSimulation } from "../hooks/useJobSimulation";
import { useStartSubmission, useSubmitSimulation } from "../hooks/useSubmission";
import { useSimulationRunStore, type TaskAnswer } from "../store/useSimulationRunStore";
import { useSimulationTimer } from "../hooks/useSimulationTimer";
import { useConnectionMonitor } from "../hooks/useConnectionMonitor";
import { useAutosaveAnswer } from "../hooks/useAutosaveAnswer";
import { useTabVisibilityGuard } from "../hooks/useTabVisibilityGuard";
import { useFullscreenGuard } from "../hooks/useFullscreenGuard";
import { useIdleDetection } from "../hooks/useIdleDetection";
import { useClipboardMonitoring } from "../hooks/useClipboardMonitoring";
import { useSimulationIntegrityStore } from "../hooks/useSimulationIntegrityStore";
import { TaskResponseInput } from "../components/TaskResponseInput";
import { AnswerActions, AnswerDock } from "../components/interfaceAnswers/AnswerDock";
import StagedChatTask from "../staged-chat/StagedChatTask";
import { TimeWarningBanner } from "../components/TimeWarningBanner";
import { ConnectionBanner } from "../components/ConnectionBanner";
import { SimulationCompleteModal } from "../components/SimulationCompleteModal";
import type { CandidateAnswer } from "../types/submission";

const EMPTY_ANSWER: TaskAnswer = { objectiveResponse: null, textResponse: "" };

// The pre-simulation screen promises "extended periods of inactivity are flagged for review" —
// this is that threshold: the minimum length a gap between activity has to reach before it's
// logged as an idle spell at all. Below this, a pause is just thinking, not idle. See
// useIdleDetection — each qualifying spell is reported with its own real duration, not counted
// as a number of fixed-size ticks.
const IDLE_THRESHOLD_MS = 5 * 60 * 1000;

// The grader reads one text field per task (CandidateAnswer.responseBody — see
// submissions.schema.ts), so a task's objective response and its written response are
// collapsed into a single string here. The structured answer is sent too (toCandidateAnswer), so
// review pages can show it the way the candidate gave it. How the objective part reads is resolved
// per componentType via OBJECTIVE_ANSWER_DESCRIBERS — this function doesn't special-case any
// one component type, matching TaskObjectiveOptions' registry-driven rendering.
function buildResponseBody(task: CandidateSimulationTask, answer: TaskAnswer): string {
    const parts: string[] = [];

    if (task.objectiveComponent != null) {
        const describe = OBJECTIVE_ANSWER_DESCRIBERS[task.objectiveComponent.componentType];
        const described = describe?.(task.objectiveComponent, answer.objectiveResponse);
        if (described) parts.push(described);
    }

    if (answer.textResponse.trim()) {
        parts.push(answer.textResponse.trim());
    }

    return parts.join("\n\n");
}

function toCandidateAnswer(
    task: CandidateSimulationTask,
    answer: TaskAnswer,
    timeSpentSeconds: number,
): CandidateAnswer {
    return {
        taskId: task.id,
        responseBody: buildResponseBody(task, answer),
        objectiveResponse: answer.objectiveResponse,
        textResponse: answer.textResponse,
        timeSpentSeconds,
    };
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
    const { appliedSet } = useAppliedJobIds();

    // Once a run is marked complete the candidate must not be able to restart it by refreshing
    // the page or revisiting the URL. Redirect immediately to the job board so the simulation
    // never re-initialises with a blank slate. getState() reads the persisted Zustand store
    // directly, so this fires correctly even after a full page reload.
    useEffect(() => {
        const { isComplete, jobId: storedJobId } = useSimulationRunStore.getState();
        if ((isComplete && storedJobId === jobId) || appliedSet.has(jobId ?? "")) {
            navigate("/job-board", { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Which task was on screen when a proctoring event fires — read via ref (not the `task`
    // variable computed further down, after the early-return loading/error checks) since the
    // guards below are wired up unconditionally near the top of the component, before that
    // variable exists. Kept current by the effect right after.
    const currentTask = simulation?.tasks[runStore.currentTaskIndex];
    useClipboardMonitoring(
        isAuthorized && !runStore.isComplete && runStore.simulationId === simulation?.id && !!runStore.submissionId,
        currentTask?.id ?? null,
    );
    const currentTaskIdRef = useRef<string | null>(null);
    useEffect(() => {
        currentTaskIdRef.current = currentTask?.id ?? null;
    }, [currentTask?.id]);

    const recordViolation = useSimulationIntegrityStore((state) => state.recordViolation);
    const recordIdleSpell = useSimulationIntegrityStore((state) => state.recordIdleSpell);
    const { scheduleSave } = useAutosaveAnswer();
    const connection = useConnectionMonitor(runStore.submissionId);

    const startSubmission = useStartSubmission();
    const submitSimulation = useSubmitSimulation();
    // Guards against StrictMode's double-effect-invoke and re-renders firing a second
    // POST — the backend creates a new Submission row on every call, it isn't idempotent.
    const hasRequestedSubmissionRef = useRef(false);
    // Guards the last-task button and the timer-expiry effect from both firing submit.
    const hasFinalizedRef = useRef(false);

    const { arm } = useTabVisibilityGuard({
        onViolation: (reason) => recordViolation(reason, currentTaskIdRef.current),
    });
    useEffect(() => {
        arm(); // arm after mount: calling arm() during render triggers setStatus → infinite loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useFullscreenGuard({
        enabled: !runStore.isComplete,
        onExit: () => recordViolation("fullscreen-exit", currentTaskIdRef.current),
    });

    // Automatically exit fullscreen when simulation is complete or when unmounting
    useEffect(() => {
        if (runStore.isComplete && document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        }
    }, [runStore.isComplete]);

    const fullscreenCleanupRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        if (fullscreenCleanupRef.current !== null) clearTimeout(fullscreenCleanupRef.current);
        return () => {
            fullscreenCleanupRef.current = setTimeout(() => {
                if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
            }, 0);
        };
    }, []);

    const idle = useIdleDetection({
        thresholdMs: IDLE_THRESHOLD_MS,
        onIdleSpell: (durationMs) => recordIdleSpell(durationMs, currentTaskIdRef.current),
    });

    useEffect(() => {
        if (job && simulation) runStore.startRun(job.id, simulation.id, simulation.timeLimitMinutes);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [job?.id, simulation?.id]);

    // Creates the Submission row for this run once job + simulation are known. Skipped
    // once the store already has a submissionId (a resumed/persisted run).
    useEffect(() => {
        if (!job || !simulation || runStore.isComplete || appliedSet.has(job.id) || runStore.submissionId || hasRequestedSubmissionRef.current) return;
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

        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        }

        // Captures a still-open idle spell that never got closed out by an activity event
        // (the candidate went idle and the run ended before they came back) — see
        // useIdleDetection's flush contract. Read fresh state via getState() right after,
        // rather than a render-time selector, so this flush's own update isn't missed.
        idle.flush();
        // Read fresh state via getState() rather than a render-time selector, so the spell
        // flush() may have just recorded isn't missed (React state from a hook selector
        // wouldn't reflect it until next render, but getState() is always current).
        const antiCheatFlags = useSimulationIntegrityStore.getState().events;

        if (!runStore.submissionId) return; // nothing to submit against; surfaced in the modal below
        const answers = simulation.tasks.map((task) =>
            toCandidateAnswer(
                task,
                runStore.answers[task.id] ?? EMPTY_ANSWER,
                runStore.taskTimeSpentSeconds[task.id] ?? 0,
            ),
        );
        submitSimulation.mutate({ submissionId: runStore.submissionId, answers, antiCheatFlags });
    }

    useEffect(() => {
        if (timer.isExpired && !runStore.isComplete && simulation && runStore.jobId === jobId && runStore.simulationId === simulation.id) {
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
                <ActionButton gradient={false} variant="outline" onClick={() => navigate("/job-board")}>
                    Back to job board
                </ActionButton>
            </div>
        );
    }

    if (!simulation) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 text-center text-neutral-700">
                <p className="text-lg">This job doesn't have a simulation ready yet.</p>
                <ActionButton gradient={false} variant="outline" onClick={() => navigate(`/job-board/${job.id}`)}>
                    Back to job details
                </ActionButton>
            </div>
        );
    }

    // The persisted run store can still hold a previous simulation's state (including a
    // currentTaskIndex past this simulation's last task) until the startRun effect above
    // resets it — wait for that instead of indexing into tasks with a stale index.
    if (runStore.simulationId !== simulation.id) {
        return <AppLoader />;
    }

    const task = simulation.tasks[runStore.currentTaskIndex];
    const answer = runStore.answers[task.id] ?? EMPTY_ANSWER;
    const isLastTask = runStore.currentTaskIndex === simulation.tasks.length - 1;

    function updateAnswer(patch: Partial<TaskAnswer>) {
        runStore.setAnswer(task.id, patch);
        scheduleSave({
            taskId: task.id,
            objectiveResponse: patch.objectiveResponse ?? answer.objectiveResponse,
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

    function handlePrevious() {
        if (runStore.currentTaskIndex > 0) {
            runStore.previousTask(task.id);
        }
    }

    if (runStore.isComplete) {
        const submitFailed = submitSimulation.isError;
        return (
            <SimulationCompleteModal
                submissionId={runStore.submissionId}
                submitStatus={submitFailed ? "error" : submitSimulation.isPending ? "pending" : "done"}
                onRetry={
                    submitFailed && runStore.submissionId
                        ? () => {
                            const answers = simulation.tasks.map((t) =>
                                toCandidateAnswer(
                                    t,
                                    runStore.answers[t.id] ?? EMPTY_ANSWER,
                                    runStore.taskTimeSpentSeconds[t.id] ?? 0,
                                ),
                            );
                            submitSimulation.mutate({
                                submissionId: runStore.submissionId!,
                                answers,
                                antiCheatFlags: useSimulationIntegrityStore.getState().events,
                            });
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

            <div className="fixed left-0 top-0 z-10 flex h-14 w-full items-center justify-between gap-3 border-b-[0.5px] border-neutral-300 bg-white/90 px-4 backdrop-blur-xl sm:px-8 lg:px-12 xl:px-30">
                <div className="flex min-w-0 flex-1 flex-col gap-1 lg:w-50.5 lg:flex-none">
                    <p className="inline-flex items-center gap-1.5 text-sm text-primary-950">
                        <span className="whitespace-nowrap">
                            Task {runStore.currentTaskIndex + 1} of {simulation.tasks.length}
                        </span>
                        {currentTask?.expectedDurationMinutes ? (
                            <>
                                <span className="text-neutral-400">•</span>
                                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                                    <Clock className="size-3 text-neutral-500" aria-hidden="true" />
                                    <span>{currentTask.expectedDurationMinutes} mins</span>
                                </span>
                            </>
                        ) : null}
                    </p>
                    <div className="h-1.5 w-full rounded-lg bg-[#d4d5d8]">
                        <div className="h-1.5 rounded bg-primary-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>

                <div className="hidden min-w-0 flex-col items-center gap-1 text-center lg:flex">
                    <p className="max-w-[40ch] truncate text-base font-medium leading-tight text-neutral-950">{job.title}</p>
                </div>

                <div className="flex shrink-0 items-center gap-3 lg:gap-4">
                    <div
                        className={`flex h-9 items-center gap-1.5 rounded px-2.5 ${timer.isWarning ? "bg-error-500" : "bg-primary-950"
                            }`}
                    >
                        <Timer className="size-4 text-neutral-50" />
                        <span className="text-xl leading-6 tabular-nums text-neutral-50">
                            {timer.formatted}
                        </span>
                    </div>
                </div>
            </div>
            <main className="mx-auto flex w-full max-w-[1600px] flex-col items-center px-4 pb-6 pt-18 sm:px-5">
                <AnswerDock><div className="flex w-full flex-col gap-6">
                    <div className="flex w-full items-center justify-between">
                        <p className="text-[16px] text-primary-500">Task {runStore.currentTaskIndex + 1}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-primary-950">{task.title}</h1>
                        <div className="prose max-w-none text-[15px] leading-relaxed text-neutral-700 prose-p:my-1.5">
                            <ReactMarkdown remarkPlugins={MARKDOWN_PLUGINS}>{task.scenarioDescription}</ReactMarkdown>
                        </div>
                        <TaskQuestion markdown={task.questionPrompt} />
                    </div>

                    <div className="flex w-full flex-col gap-6">
                        {task.interfaceType === "STAGED_CHAT" ? (
                            runStore.submissionId ? (
                                <StagedChatTask submissionId={runStore.submissionId} taskId={task.id} />
                            ) : (
                                <p role="alert" className="text-sm text-error-600">
                                    This conversation can't start yet. Refresh the page to try again.
                                </p>
                            )
                        ) : (
                            <TaskResponseInput
                                task={task}
                                value={answer.textResponse}
                                onChange={(value) => updateAnswer({ textResponse: value })}
                                objectiveResponse={answer.objectiveResponse}
                                onObjectiveChange={(response) => updateAnswer({ objectiveResponse: response })}
                            />
                        )}
                    </div>

                    <AnswerActions>{submitError && (
                        <p role="alert" className="text-center text-sm text-error-600">
                            {submitError}
                        </p>
                    )}

                    <div className="flex w-full items-center justify-between gap-3">
                        <ActionButton gradient={false}
                            variant="outline"
                            size="md"
                            onClick={handlePrevious}
                            disabled={runStore.currentTaskIndex === 0}
                            className={runStore.currentTaskIndex === 0 ? "opacity-70" : undefined}
                        >
                            Previous Task
                        </ActionButton>
                        <ActionButton gradient={false}
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
                    </AnswerActions>
                </div></AnswerDock>
            </main>
        </div>
    );
}
