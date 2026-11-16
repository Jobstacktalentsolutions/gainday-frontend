import { isAxiosError } from "axios";

export function authErrorMessage(error: unknown, fallback: string): string {
    if (isAxiosError<{ message?: unknown }>(error)) {
        const message = error.response?.data?.message;
        if (typeof message === "string" && message.trim()) return message;
        if (Array.isArray(message)) {
            const messages = message.filter((item): item is string => typeof item === "string" && !!item.trim());
            if (messages.length) return messages.join(" ");
        }
    }
    return fallback;
}
