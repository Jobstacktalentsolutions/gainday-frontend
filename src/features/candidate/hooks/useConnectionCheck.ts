import { useCallback, useState } from "react";
import { apiClient } from "@/lib/api/client";

export type ConnectionCheckStatus = "idle" | "checking" | "secure" | "failed";

// TODO: confirm a /health (or equivalent lightweight) endpoint exists on the
// backend — swap the path if it's named differently or doesn't exist yet.
// This is reused on an interval during the simulation itself to power the
// connection-lost/restored banners, not just this one-time preflight check.
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
                await apiClient.get("/health", { timeout: PING_TIMEOUT_MS });
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