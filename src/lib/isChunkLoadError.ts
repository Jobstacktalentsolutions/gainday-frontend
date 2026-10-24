// After a deploy, tabs that are still open point at old hashed files that no longer exist, so the
// next lazy-loaded page fails to download. The message differs per browser.
const CHUNK_ERROR_PATTERNS = [
    /Failed to fetch dynamically imported module/i, // Chrome, Edge
    /error loading dynamically imported module/i, // Firefox
    /Importing a module script failed/i, // Safari
    /Loading chunk [\w-]+ failed/i,
    /Unable to preload CSS/i,
]

export const isChunkLoadError = (error: unknown): boolean =>
    error instanceof Error && CHUNK_ERROR_PATTERNS.some((pattern) => pattern.test(error.message))