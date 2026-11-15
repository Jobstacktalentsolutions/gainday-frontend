import { useEffect } from "react";
import { useSimulationIntegrityStore } from "./useSimulationIntegrityStore";

export const CLIPBOARD_EVENTS = { copy: "copy", paste: "paste" } as const;

export function useClipboardMonitoring(enabled: boolean, taskId: string | null) {
    useEffect(() => {
        if (!enabled || !taskId) return;

        const recordCopy = () => useSimulationIntegrityStore.getState().recordViolation(CLIPBOARD_EVENTS.copy, taskId);
        const recordPaste = () => useSimulationIntegrityStore.getState().recordViolation(CLIPBOARD_EVENTS.paste, taskId);
        document.addEventListener(CLIPBOARD_EVENTS.copy, recordCopy, true);
        document.addEventListener(CLIPBOARD_EVENTS.paste, recordPaste, true);
        return () => {
            document.removeEventListener(CLIPBOARD_EVENTS.copy, recordCopy, true);
            document.removeEventListener(CLIPBOARD_EVENTS.paste, recordPaste, true);
        };
    }, [enabled, taskId]);
}
