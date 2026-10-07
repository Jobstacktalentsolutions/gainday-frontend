import { useCallback, useEffect, useRef, useState } from "react";

export type TabVisibilityStatus = "idle" | "armed";

interface TabVisibilityGuardOptions {
    onViolation: (reason: "Switched browser tab" | "Switched window or application") => void;
}

export function useTabVisibilityGuard({ onViolation }: TabVisibilityGuardOptions) {
    const [status, setStatus] = useState<TabVisibilityStatus>("idle");
    const armedRef = useRef(false);

    const handleVisibilityChange = useCallback(() => {
        if (armedRef.current && document.hidden) onViolation("Switched browser tab");
    }, [onViolation]);

    const handleBlur = useCallback(() => {
        if (armedRef.current) onViolation("Switched window or application");
    }, [onViolation]);

    const arm = useCallback(() => {
        armedRef.current = true;
        setStatus("armed");
    }, []);

    useEffect(() => {
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
        };
    }, [handleVisibilityChange, handleBlur]);

    return { status, arm };
}