import { useCallback, useEffect, useRef } from "react";

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "wheel"] as const;

interface Options {
    /** Minimum gap between activity to even count as an idle spell — a 30-second pause between
     *  keystrokes isn't idle, it's thinking. */
    thresholdMs: number;
    /** Called once per idle spell, with that spell's actual duration — not a fixed-size tick. */
    onIdleSpell: (durationMs: number) => void;
}

// Measures real idle *duration*, not fixed-size ticks: nothing runs on a timer while the
// candidate is idle. Instead, every activity event checks how long it's been since the last one
// and — if that gap clears thresholdMs — reports it as one idle spell with its real length,
// then resets the clock. Two idle periods separated by even a moment of activity are reported
// as two separate spells, each measured on its own, rather than merged into one running total —
// e.g. idle 6 min, active 10 sec, idle 8 min reports as two spells (6 min, 8 min), not one 14.
export function useIdleDetection({ thresholdMs, onIdleSpell }: Options) {
    // Seeded to 0, not Date.now() — reading the clock during render is impure. The real start
    // point is set in the effect below, before any listener could possibly fire.
    const lastActivityRef = useRef(0);

    const checkAndReset = useCallback(() => {
        const now = Date.now();
        const idleDuration = now - lastActivityRef.current;
        if (idleDuration >= thresholdMs) {
            onIdleSpell(idleDuration);
        }
        lastActivityRef.current = now;
    }, [thresholdMs, onIdleSpell]);

    useEffect(() => {
        lastActivityRef.current = Date.now();
        ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, checkAndReset));
        return () => ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, checkAndReset));
    }, [checkAndReset]);

    // A spell only gets reported when activity *ends* it — a candidate who goes idle and never
    // comes back (walks away for good, closes the laptop lid without touching anything) would
    // otherwise never trigger onIdleSpell at all. The caller invokes this once, when the run is
    // ending (submit or time-expiry), to capture whatever spell was still open at that moment.
    const flush = useCallback(() => {
        const idleDuration = Date.now() - lastActivityRef.current;
        if (idleDuration >= thresholdMs) {
            onIdleSpell(idleDuration);
        }
    }, [thresholdMs, onIdleSpell]);

    return { flush };
}
