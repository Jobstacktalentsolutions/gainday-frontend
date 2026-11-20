import { isAxiosError } from "axios";

export const NETWORK_ERROR_MESSAGE = "We can't reach Gainday right now. Check your connection and try again.";
export const OFFLINE_MESSAGE = "You appear to be offline. Reconnect to the internet and try again.";
export const TIMEOUT_MESSAGE = "This is taking longer than expected. Check your internet connection and try again.";
export const SERVER_ERROR_MESSAGE = "Something went wrong on our side. Please try again in a moment.";
export const EMAIL_TAKEN_MESSAGE = "An account with this email already exists. Try signing in instead.";

// Reason phrases the API framework sends when no custom message was set. They tell a user nothing,
// so they fall through to the status-based copy below.
const GENERIC_REASONS = new Set([
    "bad request",
    "unauthorized",
    "forbidden",
    "not found",
    "conflict",
    "unprocessable entity",
    "too many requests",
    "internal server error",
    "bad gateway",
    "service unavailable",
    "gateway timeout",
]);

const STATUS_MESSAGES: Record<number, string> = {
    400: "Some of the details you entered aren't valid. Please check them and try again.",
    422: "Some of the details you entered aren't valid. Please check them and try again.",
    429: "Too many attempts. Please wait a few minutes and try again.",
};

export type StatusMessages = Partial<Record<number, string>>;

const readMessage = (data: unknown): string | null => {
    if (!data || typeof data !== "object") return null;
    const { message } = data as { message?: unknown };
    const parts = (Array.isArray(message) ? message : [message]).filter(
        (item): item is string => typeof item === "string" && item.trim().length > 0,
    );
    const text = parts.join(" ").trim();
    return text && !GENERIC_REASONS.has(text.toLowerCase()) ? text : null;
};

/** A request that got no response at all: it timed out, the device is offline, or the server is unreachable. */
const noResponseMessage = (code: string | undefined): string => {
    if (code === "ECONNABORTED" || code === "ETIMEDOUT") return TIMEOUT_MESSAGE;
    if (typeof navigator !== "undefined" && navigator.onLine === false) return OFFLINE_MESSAGE;
    return NETWORK_ERROR_MESSAGE;
};

/**
 * The most specific message we can show for a failed auth request, in this order:
 * 1. what the API said, verbatim (one message, or a list of validation messages);
 * 2. the caller's message for that status (e.g. 401 on sign-in, 409 on sign-up);
 * 3. a built-in message for the kind of failure (429, no connection, timeout, 5xx);
 * 4. the caller's fallback.
 */
export function authErrorMessage(error: unknown, fallback: string, byStatus: StatusMessages = {}): string {
    if (!isAxiosError(error)) return fallback;
    if (!error.response) return noResponseMessage(error.code);

    const { status, data } = error.response;
    return (
        readMessage(data) ??
        byStatus[status] ??
        STATUS_MESSAGES[status] ??
        (status >= 500 ? SERVER_ERROR_MESSAGE : fallback)
    );
}