import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { consumeSseStream } from "./sseStream";
import { estimateSecondsRemaining } from "../utils/generationProgress";
import type { GenerationProgress } from "../types/generationProgress";

export type GenerationStreamStatus = "idle" | "generating" | "done" | "error";

/** Passed via router navigation state when Job Details has just queued a generation. */
export interface GenerationNavState {
  generationQueued?: boolean;
}

/**
 * Streams the queued full generation's progress over SSE. Replaces polling the job row: the server
 * sends current state on connect, then live progress until done or error. Only connects while
 * `enabled`; `restart` reopens the stream after a retry.
 */
export const useGenerationProgress = (
  jobId: string | null,
  enabled: boolean,
) => {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [status, setStatus] = useState<GenerationStreamStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!jobId || !enabled) return;

    const controller = new AbortController();
    let startedAt: number | null = null;

    consumeSseStream(
      `/simulations/job/${jobId}/generation-progress`,
      undefined,
      (event) => {
        if (event.type === "progress") {
          const next = event.payload as GenerationProgress;
          if (startedAt === null) startedAt = Date.now();
          setStatus("generating");
          setProgress(next);
          setSecondsRemaining(
            estimateSecondsRemaining(next.percent, Date.now() - startedAt),
          );
        } else if (event.type === "done") {
          setStatus("done");
          void queryClient.invalidateQueries({
            queryKey: ["employer", "job-simulation", jobId],
          });
        } else if (event.type === "error") {
          setStatus("error");
          setError(event.payload as string);
        }
      },
      controller.signal,
      "GET",
    ).catch(() => {
      if (controller.signal.aborted) return;
      setStatus("error");
      setError("Lost connection while generating tasks.");
    });

    return () => controller.abort();
  }, [jobId, enabled, attempt, queryClient]);

  const restart = useCallback(() => {
    setStatus("generating");
    setError(null);
    setProgress(null);
    setSecondsRemaining(null);
    setAttempt((current) => current + 1);
  }, []);

  return { progress, secondsRemaining, status, error, restart };
};
