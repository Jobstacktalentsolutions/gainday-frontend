import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

interface AutosavePayload {
    taskId: string;
    selectedOptionIndex: number | null;
    textResponse: string;
}

// TODO: replace with a real PATCH /submissions/:id/answers call once the
// backend endpoint exists — same { data } shape so callers don't change.
async function mockSaveAnswer(payload: AutosavePayload) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: { savedAt: new Date().toISOString(), ...payload } };
}

const AUTOSAVE_DEBOUNCE_MS = 2000;

export function useAutosaveAnswer() {
    const mutation = useMutation({ mutationFn: mockSaveAnswer });
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => () => clearTimeout(timeoutRef.current), []);

    function scheduleSave(payload: AutosavePayload) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => mutation.mutate(payload), AUTOSAVE_DEBOUNCE_MS);
    }

    return { scheduleSave, lastSavedAt: mutation.data?.data.savedAt ?? null, isSaving: mutation.isPending };
}