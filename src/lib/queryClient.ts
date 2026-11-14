import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const MAX_RETRIES = 2;

/** Retry network errors and 5xx, never 4xx: a 401, 403, 404 or 422 won't fix itself by asking again. */
export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
    const status = isAxiosError(error) ? error.response?.status : undefined;
    if (status !== undefined && status >= 400 && status < 500) return false;
    return failureCount < MAX_RETRIES;
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60_000,
            retry: shouldRetryQuery,
        },
    },
});