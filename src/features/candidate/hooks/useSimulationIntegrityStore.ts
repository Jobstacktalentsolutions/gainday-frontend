import { create } from "zustand";

interface SimulationIntegrityState {
  /** Occurrence count per violation type (e.g. "tab-hidden": 3, "fullscreen-exit": 1) — every
   *  occurrence increments its count, unlike the old deduped antiCheatFlags: string[], which
   *  only ever recorded whether a violation happened at all, not how many times. */
  violationCounts: Record<string, number>;
  recordViolation: (type: string) => void;
  reset: () => void;
}

// Deliberately NOT persisted — a refresh mid-proctored-simulation is something the tab-
// visibility guard and the server-side heartbeat-staleness check already surface on their own
// terms; silently carrying counts across a fresh mount via localStorage would double up with
// that rather than add signal.
export const useSimulationIntegrityStore = create<SimulationIntegrityState>((set) => ({
  violationCounts: {},
  recordViolation: (type) =>
    set((state) => ({
      violationCounts: { ...state.violationCounts, [type]: (state.violationCounts[type] ?? 0) + 1 },
    })),
  reset: () => set({ violationCounts: {} }),
}));

// The wire format for CandidateAnswer's antiCheatFlags: string[] (submissions.schema.ts) — e.g.
// ["tab-hidden ×3", "fullscreen-exit ×1"]. Kept alongside the store since it's the one place
// that knows both the in-memory shape and what the backend expects.
export function formatViolationFlags(violationCounts: Record<string, number>): string[] {
  return Object.entries(violationCounts)
    .filter(([, count]) => count > 0)
    .map(([type, count]) => `${type} ×${count}`);
}
