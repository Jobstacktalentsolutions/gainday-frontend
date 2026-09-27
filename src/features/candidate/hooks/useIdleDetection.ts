import { useEffect, useRef } from "react";

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "wheel"] as const;

interface Options {
    thresholdMs: number;
    onIdleInterval: () => void;
}

// Fires onIdleInterval once every `thresholdMs` of continuous inactivity — not just once per
// idle spell, so a candidate idle for 3x the threshold in one stretch counts as 3 occurrences,
// matching how the other violation types (tab-hidden, fullscreen-exit) count each occurrence
// rather than just whether it happened at all. Any listened activity resets the clock.
export function useIdleDetection({ thresholdMs, onIdleInterval }: Options) {
    const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

    useEffect(() => {
        function resetTimer() {
            clearInterval(timerRef.current);
            timerRef.current = setInterval(onIdleInterval, thresholdMs);
        }

        resetTimer();
        ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetTimer));

        return () => {
            clearInterval(timerRef.current);
            ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
        };
    }, [thresholdMs, onIdleInterval]);
}
