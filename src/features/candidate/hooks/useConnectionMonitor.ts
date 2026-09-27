import { useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/api/client";

export type ConnectionStatus = "online" | "lost" | "restored";

const PING_INTERVAL_MS = 20_000;
const PING_TIMEOUT_MS = 4000;

// TODO: same /health assumption as useConnectionCheck — confirm the real path.
export function useConnectionMonitor() {
  const [status, setStatus] = useState<ConnectionStatus>("online");
  const wasLostRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await apiClient.get("/health", { timeout: PING_TIMEOUT_MS });
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
  }, []);

  return { status, dismissRestored: () => setStatus("online") };
}