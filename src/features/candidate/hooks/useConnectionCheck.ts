import { useCallback, useState } from "react";
import { apiClient } from "@/lib/api/client";

export type ConnectionCheckStatus = "idle" | "checking" | "secure" | "failed";

// There's no bare /health route — during the simulation itself, the connection-lost/restored
// banners ping POST /submissions/:id/heartbeat instead (see useConnectionMonitor), since that's
// authenticated and tied to the candidate's actual submission, doubling as an anti-cheat
// liveness signal. That endpoint needs a submission (and therefore a signed-in candidate) to
// exist first, neither of which this page can assume — PreSimulation/EnvironmentCheckPage
// aren't gated behind sign-in — so this preflight instead pings the root route (`GET /`),
// which needs no auth and exists purely to prove the API is reachable at all. If this page
// starts requiring sign-in before showing itself, this can move to the stronger `/auth/me`
// check (proves "reachable AND still authenticated", not just "reachable").
const PING_COUNT = 3;
const PING_TIMEOUT_MS = 4000;

export function useConnectionCheck() {
    const [status, setStatus] = useState<ConnectionCheckStatus>("idle");
    const [latencyMs, setLatencyMs] = useState<number | null>(null);

    const run = useCallback(async () => {
        setStatus("checking");
        const samples: number[] = [];

        try {
            for (let i = 0; i < PING_COUNT; i++) {
                const start = performance.now();
                await apiClient.get("/", { timeout: PING_TIMEOUT_MS });
                samples.push(performance.now() - start);
            }
            const sorted = [...samples].sort((a, b) => a - b);
            setLatencyMs(Math.round(sorted[Math.floor(sorted.length / 2)]));
            setStatus("secure");
        } catch (error) {
            console.error("Connection check failed", error);
            setStatus("failed");
            setLatencyMs(null);
        }
    }, []);

    return { status, latencyMs, run };
}