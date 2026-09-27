import { useEffect, useState } from "react";

const WARNING_THRESHOLD_SECONDS = 5 * 60;

export function useSimulationTimer(endTimestamp: number | null) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    endTimestamp ? Math.max(0, Math.round((endTimestamp - Date.now()) / 1000)) : 0,
  );

  useEffect(() => {
    if (!endTimestamp) return;
    const interval = setInterval(() => {
      setRemainingSeconds(Math.max(0, Math.round((endTimestamp - Date.now()) / 1000)));
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