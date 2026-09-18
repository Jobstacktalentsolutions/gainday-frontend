import { useCallback, useRef, useState } from "react";
import { consumeSseStream } from "./sseStream";
import type { SimulationTask } from "@/features/simulation-tasks/types";

type RegenerateStatus = "idle" | "generating" | "done" | "error";

// Backend: Nest @Sse() on POST /simulations/job/:jobId/regenerate-task (see
// simulations.controller.ts) — reuses the job's existing extraction, skips the critic, and
// streams back exactly one task. Two distinct behaviors depending on the arguments: passing both
// `guidance` and `existingTask` EDITS that task per the instruction (keeps everything the
// instruction didn't touch); passing `guidance` alone (or neither) generates a brand-new task —
// see GenerationService.regenerateTask for why these are separate paths, not one with a hint.
export const useRegenerateTask = () => {
    const [status, setStatus] = useState<RegenerateStatus>("idle");
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const regenerate = useCallback(
        (jobId: string, guidance?: string, existingTask?: SimulationTask): Promise<SimulationTask> => {
            setStatus("generating");
            setError(null);
            const controller = new AbortController();
            abortRef.current = controller;

            return new Promise((resolve, reject) => {
                let resolved = false;
                consumeSseStream(
                    `/simulations/job/${jobId}/regenerate-task`,
                    { guidance, existingTask },
                    (event) => {
                        if (event.type === "task") {
                            resolved = true;
                            setStatus("done");
                            resolve(event.payload as SimulationTask);
                        } else if (event.type === "error") {
                            resolved = true;
                            const message =
                                typeof event.payload === "string"
                                    ? event.payload
                                    : "Task regeneration failed";
                            setStatus("error");
                            setError(message);
                            reject(new Error(message));
                        }
                        // "status" events (e.g. "generating") — no UI action needed beyond the
                        // caller's own busy state.
                    },
                    controller.signal,
                )
                    .then(() => {
                        if (!resolved) {
                            throw new Error("Stream ended without a result");
                        }
                    })
                    .catch((err) => {
                        if (controller.signal.aborted || resolved) return;
                        const message =
                            err instanceof Error ? err.message : "Task regeneration failed";
                        setStatus("error");
                        setError(message);
                        reject(new Error(message));
                    });
            });
        },
        [],
    );

    const cancel = useCallback(() => {
        abortRef.current?.abort();
        setStatus("idle");
    }, []);

    return { regenerate, cancel, status, error };
};
