import { useCallback, useState } from "react";

export type FullscreenCheckStatus = "idle" | "ready" | "failed";

export function useFullscreenCheck() {
  const [status, setStatus] = useState<FullscreenCheckStatus>("idle");

  // Must be invoked synchronously from a user-gesture handler (a button
  // onClick) on Pre-Simulation — browsers reject requestFullscreen() once
  // there's an await/navigation between the click and the call.
  const requestFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setStatus("ready");
      return true;
    } catch (error) {
      console.error("Fullscreen request failed", error);
      setStatus("failed");
      return false;
    }
  }, []);

  // Called on the environment-check screen to confirm we're still in
  // fullscreen — covers the browser silently ignoring the request, or the
  // candidate exiting immediately after granting it.
  const verify = useCallback(() => {
    const isFullscreen = Boolean(document.fullscreenElement);
    setStatus(isFullscreen ? "ready" : "failed");
    return isFullscreen;
  }, []);

  return { status, requestFullscreen, verify };
}