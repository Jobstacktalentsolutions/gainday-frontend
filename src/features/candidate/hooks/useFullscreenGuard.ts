import { useCallback, useEffect, useRef } from "react";

interface Options {
    enabled?: boolean;
    onExit: () => void;
}

// Watches document.fullscreenElement for the life of the mounted component and calls onExit
// once per transition out of fullscreen — separate from useFullscreenCheck (the one-shot
// request/verify used on Pre-Simulation before the run starts): this one is a standing
// listener for the live simulation, symmetrical with useTabVisibilityGuard. Re-entering and
// exiting fullscreen again during the same run counts as a second, independent occurrence.
export function useFullscreenGuard({ enabled = true, onExit }: Options) {
    const wasFullscreenRef = useRef(Boolean(document.fullscreenElement));

    const handleChange = useCallback(() => {
        const isFullscreen = Boolean(document.fullscreenElement);
        if (enabled && wasFullscreenRef.current && !isFullscreen) {
            onExit();
        }
        wasFullscreenRef.current = isFullscreen;
    }, [enabled, onExit]);

    useEffect(() => {
        if (!enabled) return;
        document.addEventListener("fullscreenchange", handleChange);
        return () => document.removeEventListener("fullscreenchange", handleChange);
    }, [enabled, handleChange]);
}
