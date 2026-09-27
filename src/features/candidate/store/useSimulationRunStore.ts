import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TaskAnswer {
    selectedOptionIndex: number | null;
    textResponse: string;
}

interface SimulationRunState {
    jobId: string | null;
    simulationId: string | null;
    endTimestamp: number | null;
    currentTaskIndex: number;
    answers: Record<string, TaskAnswer>;
    isComplete: boolean;
    startRun: (jobId: string, simulationId: string, timeLimitMinutes: number) => void;
    setAnswer: (taskId: string, answer: Partial<TaskAnswer>) => void;
    advanceTask: () => void;
    markComplete: () => void;
    resetRun: () => void;
}

// Forward-only by design (your call): there is deliberately no
// goToPreviousTask — currentTaskIndex only ever increases. Persisted via
// Zustand's persist middleware, not route params, so refreshing the page
// resumes from where the candidate was without giving the browser back
// button a history entry to exploit (see the routing tradeoff discussion).
export const useSimulationRunStore = create<SimulationRunState>()(
    persist(
        (set, get) => ({
            jobId: null,
            simulationId: null,
            endTimestamp: null,
            currentTaskIndex: 0,
            answers: {},
            isComplete: false,

            startRun: (jobId, simulationId, timeLimitMinutes) => {
                const state = get();
                // idempotent — a remount/refresh for the same active session must not
                // reset the timer or wipe progress. But a completed run must always
                // restart — otherwise persisted isComplete:true blocks the new session.
                if (
                    !state.isComplete &&
                    state.jobId === jobId &&
                    state.simulationId === simulationId &&
                    state.endTimestamp !== null
                ) return;
                set({
                    jobId,
                    simulationId,
                    endTimestamp: Date.now() + timeLimitMinutes * 60 * 1000,
                    currentTaskIndex: 0,
                    answers: {},
                    isComplete: false,
                });
            },

            setAnswer: (taskId, answer) =>
                set((state) => {
                    const existing = state.answers[taskId] ?? { selectedOptionIndex: null, textResponse: "" };
                    return {
                        answers: {
                            ...state.answers,
                            [taskId]: { ...existing, ...answer },
                        },
                    };
                }),

            advanceTask: () => set((state) => ({ currentTaskIndex: state.currentTaskIndex + 1 })),

            markComplete: () => set({ isComplete: true }),

            resetRun: () =>
                set({ jobId: null, simulationId: null, endTimestamp: null, currentTaskIndex: 0, answers: {}, isComplete: false }),
        }),
        { name: "gainday-simulation-run" },
    ),
);