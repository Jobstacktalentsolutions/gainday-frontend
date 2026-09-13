import { getBaseURL } from "@/lib/api/client";
import { useAuthStore } from "@/features/auth/store/authStore";

export interface SseEvent<T = unknown> {
    type: string;
    payload: T;
}

/**
 * Consumes a Nest `@Sse()` POST endpoint via fetch() + a manual ReadableStream reader — the
 * browser's native EventSource can't send an Authorization header or a POST body, but ordinary
 * fetch with both works fine for reading a `text/event-stream` response. Shared by every
 * SSE-driven regenerate flow in the employer simulation builder.
 */
export async function consumeSseStream(
    path: string,
    body: unknown,
    onEvent: (event: SseEvent) => void,
    signal: AbortSignal,
): Promise<void> {
    const token = useAuthStore.getState().accessToken;
    const res = await fetch(`${getBaseURL()}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
        signal,
        credentials: "include",
    });

    if (!res.ok || !res.body) {
        throw new Error(`Request failed (${res.status})`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) return;
        buffer += decoder.decode(value, { stream: true });

        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";

        for (const frame of frames) {
            const dataLines = frame
                .split("\n")
                .filter((line) => line.startsWith("data:"))
                .map((line) => line.slice(5).trim());
            if (dataLines.length === 0) continue;

            onEvent(JSON.parse(dataLines.join("")) as SseEvent);
        }
    }
}
