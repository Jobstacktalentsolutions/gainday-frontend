import { useCallback, useRef, useState } from "react";
import { consumeSseStream } from "./sseStream";
import type { SimulationTask } from "@/features/simulation-tasks/types";

type RegenerateAllStatus = "idle" | "generating" | "done" | "error";

interface RegenerateAllOptions {
    onTask: (task: SimulationTask) => void;
}

// Backend: Nest @Sse() on POST /simulations/job/:jobId/regenerate-all-tasks — streams a fresh
// regeneration of every current task slot one at a time over the same lightweight path as a
// single-task regenerate (no BullMQ queue, no re-run of extraction/critic), so the UI can fill
// tasks in progressively instead of blocking on one opaque "generating..." wait.
export const useRegenerateAllTasks = () => {
    const [status, setStatus] = useState<RegenerateAllStatus>("idle");
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const regenerateAll = useCallback(
        (jobId: string, count: number, { onTask }: RegenerateAllOptions): Promise<void> => {
            setStatus("generating");
            setError(null);
            const controller = new AbortController();
            abortRef.current = controller;

            return new Promise((resolve, reject) => {
                let doneReceived = false;
                consumeSseStream(
                    `/simulations/job/${jobId}/regenerate-all-tasks`,
                    { count },
                    (event) => {
                        if (event.type === "task") {
                            onTask(event.payload as SimulationTask);
                        } else if (event.type === "done") {
                            doneReceived = true;
                            setStatus("done");
                            resolve();
                        } else if (event.type === "error") {
                            doneReceived = true;
                            const message =
                                typeof event.payload === "string"
                                    ? event.payload
                                    : "Regeneration failed";
                            setStatus("error");
                            setError(message);
                            reject(new Error(message));
                        }
                    },
                    controller.signal,
                )
                    .then(() => {
                        if (!doneReceived) {
                            throw new Error("Stream ended without completing");
                        }
                    })
                    .catch((err) => {
                        if (controller.signal.aborted || doneReceived) return;
                        const message =
                            err instanceof Error ? err.message : "Regeneration failed";
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

    return { regenerateAll, cancel, status, error };
};
