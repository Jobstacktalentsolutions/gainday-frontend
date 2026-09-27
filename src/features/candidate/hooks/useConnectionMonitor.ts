import { useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/api/client";

export type ConnectionStatus = "online" | "lost" | "restored";

const PING_INTERVAL_MS = 20_000;
const PING_TIMEOUT_MS = 4000;

/**
 * Pings POST /submissions/:id/heartbeat on an interval — an authenticated liveness check tied
 * to the candidate's own active submission (see SubmissionsService.recordHeartbeat), not a bare
 * /health check. Doubles as the anti-cheat "are they actually still here" signal: the backend
 * auto-flags the submission if too much time passes between the last heartbeat and final
 * submit (HEARTBEAT_STALE_THRESHOLD_MS).
 *
 * Stays "online" (no ping fired) until a submissionId exists — there's nothing to heartbeat
 * against yet in the brief window between mount and POST /submissions/job/:jobId/start
 * resolving, and a false "lost" banner in that window would be misleading.
 */
export function useConnectionMonitor(submissionId: string | null) {
  const [status, setStatus] = useState<ConnectionStatus>("online");
  const wasLostRef = useRef(false);

  useEffect(() => {
    if (!submissionId) return;

    const interval = setInterval(async () => {
      try {
        await apiClient.post(`/submissions/${submissionId}/heartbeat`, undefined, {
          timeout: PING_TIMEOUT_MS,
        });
        if (wasLostRef.current) {
          setStatus("restored");
          wasLostRef.current = false;
        } else {
          setStatus("online");
        }
      } catch {
        wasLostRef.current = true;
        setStatus("lost");
      }
    }, PING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [submissionId]);

  return { status, dismissRestored: () => setStatus("online") };
}
