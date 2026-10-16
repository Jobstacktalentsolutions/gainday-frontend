import type { IntegrityEventSummary, IntegrityStatus } from "../types/submission";

// `summary` is the closing line of the Integrity card on the individual submission page.
// `type` is an open string on the backend (a new listener needs no migration), so an unknown
// type is shown as-is rather than hidden.
const INTEGRITY_EVENT_LABELS: Record<string, string> = {
    "tab-hidden": "Tab switches",
    "window-blur": "Window focus lost",
    "fullscreen-exit": "Fullscreen exits",
    idle: "Idle periods",
    "server-stale-heartbeat": "Connection lost",
};

export const formatIntegrityEvent = ({ type, count }: IntegrityEventSummary): string =>
    `${INTEGRITY_EVENT_LABELS[type] ?? type} \u00d7${count}`;

export const INTEGRITY_META: Record<IntegrityStatus, { label: string; textClass: string; summary: string }> = {
    CLEAN: { label: "Clean", textClass: "text-success-500", summary: "Integrity checked" },
    MINOR_FLAGS: { label: "Minor Flags", textClass: "text-warning-500", summary: "Minor flags noted" },
    PENDING: { label: "Pending", textClass: "text-neutral-500", summary: "Integrity check in progress" },
    REVIEW_NEEDED: { label: "Review Needed", textClass: "text-error-500", summary: "Manual review recommended" },
};