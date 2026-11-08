import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { apiClient } from "@/lib/api/client";
import { getConsent } from "./consent";
import { getVisitorId } from "./visitorId";

const DEDUPE_MS = 30_000;

let lastPing: { path: string; at: number } | null = null;

/** Sends one page-view ping per route change, but only after the visitor accepted analytics. */
export function usePageViewTracker(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    if (getConsent() !== "granted") return; // checked before getVisitorId(), which creates the cookie

    const now = Date.now();
    if (lastPing?.path === pathname && now - lastPing.at < DEDUPE_MS) return;
    lastPing = { path: pathname, at: now };

    apiClient.post("/analytics/ping", { visitorId: getVisitorId() }).catch(() => {});
  }, [pathname]);
}