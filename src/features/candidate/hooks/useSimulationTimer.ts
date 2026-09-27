import { useEffect, useState } from "react";

const WARNING_THRESHOLD_SECONDS = 5 * 60;

function computeRemainingSeconds(endTimestamp: number | null): number {
  return endTimestamp ? Math.max(0, Math.round((endTimestamp - Date.now()) / 1000)) : 0;
}

export function useSimulationTimer(endTimestamp: number | null) {
  const [remainingSeconds, setRemainingSeconds] = useState(() => computeRemainingSeconds(endTimestamp));

  // Adjust state during render (React's own pattern for this — see "Adjusting some state when
  // a prop changes" in the React docs) rather than in an effect, so this is never one render
  // behind. That matters here specifically: useSimulationRunStore.startRun() replaces a stale,
  // already-expired persisted endTimestamp with a fresh one when resuming/restarting a run. An
  // effect-based recompute wouldn't run until after this render already painted with the stale
  // remainingSeconds (still reading 0 from the old value) — long enough for the isExpired-driven
  // auto-submit effect in TaskRunner to fire on a simulation that had just started.
  const [lastSeenEndTimestamp, setLastSeenEndTimestamp] = useState(endTimestamp);
  if (endTimestamp !== lastSeenEndTimestamp) {
    setLastSeenEndTimestamp(endTimestamp);
    setRemainingSeconds(computeRemainingSeconds(endTimestamp));
  }

  useEffect(() => {
    if (!endTimestamp) return;
    const interval = setInterval(() => {
      setRemainingSeconds(computeRemainingSeconds(endTimestamp));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTimestamp]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {
    remainingSeconds,
    formatted,
    isWarning: remainingSeconds <= WARNING_THRESHOLD_SECONDS && remainingSeconds > 0,
    // Only report expired when there is an active endTimestamp — a null timestamp
    // means no run is in progress yet (or the store hasn't initialised), so we must
    // not treat 0 remaining seconds as a genuine expiry in that case.
    isExpired: endTimestamp !== null && remainingSeconds <= 0,
  };
}