import { create } from "zustand";

interface SimulationIntegrityState {
  antiCheatFlags: string[];
  addFlag: (flag: string) => void;
}

// TODO: placeholder — once the task runner + submission flow exists, flags
// recorded here need to reach Submission.antiCheatFlags on final submit.
// Deliberately NOT persisted: a refresh mid-proctored-simulation is something
// the real flow needs to handle explicitly, not silently paper over via
// localStorage.
export const useSimulationIntegrityStore = create<SimulationIntegrityState>((set) => ({
  antiCheatFlags: [],
  addFlag: (flag) =>
    set((state) => ({
      antiCheatFlags: state.antiCheatFlags.includes(flag) ? state.antiCheatFlags : [...state.antiCheatFlags, flag],
    })),
}));