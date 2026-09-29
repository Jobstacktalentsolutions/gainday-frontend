import { useEffect, useRef, useState } from "react";

interface AutosavePayload {
    taskId: string;
    objectiveResponse: unknown;
    textResponse: string;
}

const AUTOSAVE_DEBOUNCE_MS = 2000;

// Deliberately local-only, not a network call — every answer already lands in
// useSimulationRunStore, which zustand's `persist` middleware writes to localStorage
// synchronously on each setAnswer, so the candidate's progress already survives a refresh
// with no request in flight. This hook exists purely to drive the header's "Saving..." →
// "Autosaved" indicator 
export function useAutosaveAnswer() {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => () => clearTimeout(timeoutRef.current), []);

    function scheduleSave(payload: AutosavePayload) {
        void payload; // kept in the signature so call sites stay unchanged if a real save lands later
        setIsSaving(true);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsSaving(false);
            setLastSavedAt(new Date().toISOString());
        }, AUTOSAVE_DEBOUNCE_MS);
    }

    return { scheduleSave, lastSavedAt, isSaving };
}
