import { create } from "zustand";

interface DemoAudioState {
    /** Shared by every demo player, so unmuting one leaves the other unmuted.
     *  Starts muted because browsers block autoplay with sound. */
    muted: boolean;
    setMuted: (muted: boolean) => void;
}

export const useDemoAudio = create<DemoAudioState>((set) => ({
    muted: true,
    setMuted: (muted) => set({ muted }),
}));

// Only one demo plays at a time: the player that starts last pauses the one before it.
let pauseActive: (() => void) | null = null;

export function claimPlayback(pause: () => void): void {
    if (pauseActive && pauseActive !== pause) pauseActive();
    pauseActive = pause;
}

export function releasePlayback(pause: () => void): void {
    if (pauseActive === pause) pauseActive = null;
}
