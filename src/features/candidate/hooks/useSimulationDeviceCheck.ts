import { useMediaQuery } from "@/hooks/useMediaQuery";

// Describes the input hardware, so it isn't fooled by "Request desktop site" on a phone.
const TOUCH_PRIMARY = "(hover: none) and (pointer: coarse)";
const NARROW_VIEWPORT = "(max-width: 1023px)";

export function useSimulationDeviceCheck() {
    const isTouchPrimary = useMediaQuery(TOUCH_PRIMARY);
    const isNarrow = useMediaQuery(NARROW_VIEWPORT);

    return {
        // Starting an assessment: needs a real desktop-class device and window.
        canStartSimulation: !isTouchPrimary && !isNarrow,
        // Already running: only a touch device is a problem. Resizing a desktop window mid-run
        // must not eject the candidate from a timed attempt.
        canContinueSimulation: !isTouchPrimary,
    };
}