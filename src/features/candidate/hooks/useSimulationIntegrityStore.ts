import { create } from "zustand";

interface SimulationIntegrityState {
  /** Occurrence count per violation type (e.g. "tab-hidden": 3, "fullscreen-exit": 1) — every
   *  occurrence increments its count, unlike an earlier deduped design that only recorded
   *  whether a violation type happened at all, not how many times. Idle time is tracked
   *  separately below, since a count alone loses how *long* each idle spell actually was. */
  violationCounts: Record<string, number>;
  recordViolation: (type: string) => void;
  /** How many separate idle spells (each already >= the idle threshold — see
   *  useIdleDetection) occurred, and their summed real duration. Two idle periods split by a
   *  moment of activity count as two spells with two durations, not one merged total — see
   *  useIdleDetection's flush/onIdleSpell contract. */
  idleSpellCount: number;
  idleTotalMs: number;
  recordIdleSpell: (durationMs: number) => void;
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

  idleSpellCount: 0,
  idleTotalMs: 0,
  recordIdleSpell: (durationMs) =>
    set((state) => ({
      idleSpellCount: state.idleSpellCount + 1,
      idleTotalMs: state.idleTotalMs + durationMs,
    })),

  reset: () => set({ violationCounts: {}, idleSpellCount: 0, idleTotalMs: 0 }),
}));

function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m${seconds}s` : `${seconds}s`;
}

// The wire format for CandidateAnswer's antiCheatFlags: string[] (submissions.schema.ts) — e.g.
// ["tab-hidden ×3", "fullscreen-exit ×1", "idle ×2 (total 14m6s)"]. Kept alongside the store
// since it's the one place that knows both the in-memory shape and what the backend expects.
export function formatViolationFlags(state: {
  violationCounts: Record<string, number>;
  idleSpellCount: number;
  idleTotalMs: number;
}): string[] {
  const flags = Object.entries(state.violationCounts)
    .filter(([, count]) => count > 0)
    .map(([type, count]) => `${type} ×${count}`);

  if (state.idleSpellCount > 0) {
    flags.push(`idle ×${state.idleSpellCount} (total ${formatDuration(state.idleTotalMs)})`);
  }

  return flags;
}
