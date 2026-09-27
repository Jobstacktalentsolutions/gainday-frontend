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
// "Autosaved" indicator with the same debounced feel a real autosave would have, without
// implying a server round-trip that doesn't happen (there is no PATCH /submissions/:id/
// answers endpoint, and answers only reach the backend once, on final submit).
export function useAutosaveAnswer() {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => () => clearTimeout(timeoutRef.current), []);

    function scheduleSave(_payload: AutosavePayload) {
        setIsSaving(true);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsSaving(false);
            setLastSavedAt(new Date().toISOString());
        }, AUTOSAVE_DEBOUNCE_MS);
    }

    return { scheduleSave, lastSavedAt, isSaving };
}
