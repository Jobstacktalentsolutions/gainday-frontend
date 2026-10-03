import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TaskAnswer {
    /** Shape depends on the task's objectiveComponent.componentType — number for
     *  SINGLE_BEST_ACTION/NUMERIC_INPUT, number[] for MULTI_SELECT_UNDER_CONSTRAINT/
     *  PROCEDURAL_SEQUENCING, Record<string,string> for CLASSIFICATION, null until the
     *  candidate answers. See objectiveAnswers/registry.tsx. */
    objectiveResponse: unknown;
    textResponse: string;
}

function accrueTaskTime(
    state: Pick<SimulationRunState, "taskTimeSpentSeconds" | "currentTaskEnteredAt">,
    taskId: string,
): Record<string, number> {
    if (state.currentTaskEnteredAt === null) return state.taskTimeSpentSeconds;
    const elapsedSeconds = Math.max(0, Math.round((Date.now() - state.currentTaskEnteredAt) / 1000));
    return {
        ...state.taskTimeSpentSeconds,
        [taskId]: (state.taskTimeSpentSeconds[taskId] ?? 0) + elapsedSeconds,
    };
}

interface SimulationRunState {
    jobId: string | null;
    simulationId: string | null;
    submissionId: string | null;
    endTimestamp: number | null;
    currentTaskIndex: number;
    answers: Record<string, TaskAnswer>;
    /** Accumulated active seconds per task id — see `advanceTask`/`markComplete`. Feeds
     *  CandidateAnswer.timeSpentSeconds on submit. */
    taskTimeSpentSeconds: Record<string, number>;
    /** When the candidate landed on the current task — the open end of the interval being
     *  accumulated into taskTimeSpentSeconds. Null once the run is complete. */
    currentTaskEnteredAt: number | null;
    isComplete: boolean;
    startRun: (jobId: string, simulationId: string, timeLimitMinutes: number) => void;
    setSubmissionId: (submissionId: string) => void;
    setAnswer: (taskId: string, answer: Partial<TaskAnswer>) => void;
    /** `taskId` is the task being left (whose elapsed time gets recorded), not the one being
     *  entered — the index simply advances by one. */
    advanceTask: (taskId: string) => void;
    /** Mirrors advanceTask, but moves backward and is clamped at 0. `taskId` is the task being
     *  left (whose elapsed time gets recorded), same contract as advanceTask. */
    goToPreviousTask: (taskId: string) => void;
    markComplete: (currentTaskId?: string) => void;
    resetRun: () => void;
   
}

// Navigation is store-driven, not route-driven, on purpose: currentTaskIndex lives in Zustand
// state, not in a route param like /task/:index. That's what keeps the browser back button
// from becoming a bypass around whatever navigation rules this store enforces — there's no
// per-task history entry for it to exploit. Backward navigation (goToPreviousTask) is
// therefore implemented as an explicit, gated state transition here, not as routing freedom.
export const useSimulationRunStore = create<SimulationRunState>()(
    persist(
        (set, get) => ({
            jobId: null,
            simulationId: null,
            submissionId: null,
            endTimestamp: null,
            currentTaskIndex: 0,
            answers: {},
            taskTimeSpentSeconds: {},
            currentTaskEnteredAt: null,
            isComplete: false,

            startRun: (jobId, simulationId, timeLimitMinutes) => {
                const state = get();
                // idempotent — a remount/refresh for the same active session must not
                // reset the timer or wipe progress. But a completed run must always
                // restart — otherwise persisted isComplete:true blocks the new session.
                // Also restart if the stored endTimestamp is already in the past: that
                // means the previous session expired and was never properly cleaned up
                // (e.g. the tab was closed before markComplete ran), so treat it as a
                // fresh run rather than resuming a dead timer.
                if (
                    !state.isComplete &&
                    state.jobId === jobId &&
                    state.simulationId === simulationId &&
                    state.endTimestamp !== null &&
                    state.endTimestamp > Date.now()
                ) return;
                set({
                    jobId,
                    simulationId,
                    submissionId: null,
                    endTimestamp: Date.now() + timeLimitMinutes * 60 * 1000,
                    currentTaskIndex: 0,
                    answers: {},
                    taskTimeSpentSeconds: {},
                    currentTaskEnteredAt: Date.now(),
                    isComplete: false,
                });
            },

            setSubmissionId: (submissionId) => set({ submissionId }),

            setAnswer: (taskId, answer) =>
                set((state) => {
                    const existing = state.answers[taskId] ?? { objectiveResponse: null, textResponse: "" };
                    return {
                        answers: {
                            ...state.answers,
                            [taskId]: { ...existing, ...answer },
                        },
                    };
                }),

            advanceTask: (taskId) =>
                set((state) => ({
                    currentTaskIndex: state.currentTaskIndex + 1,
                    taskTimeSpentSeconds: accrueTaskTime(state, taskId),
                    currentTaskEnteredAt: Date.now(),
                })),

            goToPreviousTask: (taskId) =>
                set((state) => ({
                    currentTaskIndex: Math.max(0, state.currentTaskIndex - 1),
                    taskTimeSpentSeconds: accrueTaskTime(state, taskId),
                    currentTaskEnteredAt: Date.now(),
                })),

            markComplete: (currentTaskId) =>
                set((state) => ({
                    isComplete: true,
                    taskTimeSpentSeconds: currentTaskId ? accrueTaskTime(state, currentTaskId) : state.taskTimeSpentSeconds,
                    currentTaskEnteredAt: null,
                })),

            resetRun: () =>
                set({
                    jobId: null,
                    simulationId: null,
                    submissionId: null,
                    endTimestamp: null,
                    currentTaskIndex: 0,
                    answers: {},
                    taskTimeSpentSeconds: {},
                    currentTaskEnteredAt: null,
                    isComplete: false,
                }),
        }),
        { name: "gainday-simulation-run" },
    ),
);