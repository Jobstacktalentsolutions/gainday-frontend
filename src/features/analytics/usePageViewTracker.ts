import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { apiClient } from "@/lib/api/client";
import { getVisitorId } from "./visitorId";

// Strict Mode and quick back-and-forth navigation can fire the same path twice; one ping covers it.
const DEDUPE_MS = 30_000;

let lastPing: { path: string; at: number } | null = null;

/** Sends one page-view ping per route change. Tracking never surfaces errors to the visitor. */
export function usePageViewTracker(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    const now = Date.now();
    if (lastPing?.path === pathname && now - lastPing.at < DEDUPE_MS) return;
    lastPing = { path: pathname, at: now };

    apiClient.post("/analytics/ping", { visitorId: getVisitorId() }).catch(() => {});
  }, [pathname]);
}
