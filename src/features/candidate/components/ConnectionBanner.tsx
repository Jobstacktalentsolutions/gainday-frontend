import { Wifi, WifiOff, X } from "lucide-react";
import type { ConnectionStatus } from "../hooks/useConnectionMonitor";

interface ConnectionBannerProps {
  status: Extract<ConnectionStatus, "lost" | "restored">;
  onDismiss: () => void;
}

export function ConnectionBanner({ status, onDismiss }: ConnectionBannerProps) {
  const isLost = status === "lost";

  return (
    <div
      className={`fixed left-0 top-[117px] z-20 flex w-full items-center justify-center gap-12 border-b p-3 ${
        isLost ? "border-error-500 bg-error-50" : "border-success-500 bg-success-50"
      }`}
    >
      <div className="flex items-center gap-3">
        {isLost ? (
          <WifiOff className="size-6 text-error-500" />
        ) : (
          <Wifi className="size-6 text-success-500" />
        )}
        <p className={`text-[16px] ${isLost ? "text-error-500" : "text-success-500"}`}>
          {isLost
            ? "Connection lost. Your timer keeps running server-side — reconnect as soon as possible."
            : "Connection restored. Elapsed time is synced and all saved answers were retained."}
        </p>
      </div>
      {!isLost && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss">
          <X className="size-6 text-success-500" />
        </button>
      )}
    </div>
  );
}