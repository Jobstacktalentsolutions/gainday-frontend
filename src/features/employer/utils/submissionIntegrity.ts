import type { IntegrityStatus } from "../types/submission";

// `summary` is the closing line of the Integrity card on the individual submission page.
export const INTEGRITY_META: Record<IntegrityStatus, { label: string; textClass: string; summary: string }> = {
    CLEAN: { label: "Clean", textClass: "text-success-500", summary: "Integrity checked" },
    MINOR_FLAGS: { label: "Minor Flags", textClass: "text-warning-500", summary: "Minor flags noted" },
    PENDING: { label: "Pending", textClass: "text-neutral-500", summary: "Integrity check in progress" },
    REVIEW_NEEDED: { label: "Review Needed", textClass: "text-error-500", summary: "Manual review recommended" },
};