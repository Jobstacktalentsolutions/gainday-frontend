// The one place unexpected UI errors go. Today it only logs. To add Sentry later, call
// Sentry.captureException(error, { extra: context }) here and nothing else needs to change.
export const reportError = (error: Error, context?: Record<string, unknown>): void => {
    console.error("[AppErrorBoundary]", error, context)
}