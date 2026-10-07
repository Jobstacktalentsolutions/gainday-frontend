import { create } from "zustand";
import type { AntiCheatEvent } from "../types/submission";

// Bounds the in-memory log against a pathological run (e.g. scripted rapid-fire fullscreen
// toggling) — the backend enforces its own independent cap
// (MAX_ANTI_CHEAT_EVENTS in submissions.service.ts), this is just the client-side half of that.
const MAX_EVENTS = 500;

interface SimulationIntegrityState {
  /** The full per-event log for this run — replaces an earlier design that only kept an
   *  aggregate count per violation type for the whole run, with no record of *when* each one
   *  happened or which task was active at the time. Sent as-is (no summarizing) as
   *  antiCheatFlags in the submit body — see submissions.schema.ts's AntiCheatEvent. */
  events: AntiCheatEvent[];
  recordViolation: (type: string, taskId: string | null) => void;
  /** durationMs is the idle spell's real measured length — see useIdleDetection.ts. */
  recordIdleSpell: (durationMs: number, taskId: string | null) => void;
  reset: () => void;
}

// Deliberately NOT persisted — a refresh mid-proctored-simulation is something the tab-
// visibility guard and the server-side heartbeat-staleness check already surface on their own
// terms; silently carrying a log across a fresh mount via localStorage would double up with
// that rather than add signal.
export const useSimulationIntegrityStore = create<SimulationIntegrityState>((set) => ({
  events: [],

  recordViolation: (type, taskId) =>
    set((state) => ({
      events: [...state.events, { type, taskId, occurredAt: new Date().toISOString() }].slice(-MAX_EVENTS),
    })),

  recordIdleSpell: (durationMs, taskId) =>
    set((state) => ({
      events: [
        ...state.events,
        { type: "Inactivity detected", taskId, occurredAt: new Date().toISOString(), durationMs },
      ].slice(-MAX_EVENTS),
    })),

  reset: () => set({ events: [] }),
}));

// A quick human-readable rollup of the event log — e.g. { "tab-hidden": { count: 3 }, "idle": {
// count: 2, totalDurationMs: 846000 } }. Not sent to the backend (the raw event log is), this is
// purely for anywhere that wants a summary view (console debugging today; a future employer-
// facing review UI would more likely want this than the raw log).
export function summarizeAntiCheatEvents(
  events: AntiCheatEvent[],
): Record<string, { count: number; totalDurationMs: number }> {
  const summary: Record<string, { count: number; totalDurationMs: number }> = {};
  for (const event of events) {
    const entry = summary[event.type] ?? { count: 0, totalDurationMs: 0 };
    entry.count += 1;
    entry.totalDurationMs += event.durationMs ?? 0;
    summary[event.type] = entry;
  }
  return summary;
}
