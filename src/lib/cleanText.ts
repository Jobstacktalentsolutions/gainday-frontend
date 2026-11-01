const EMPTY_ANSWERS = new Set(["null", "none", "n/a", "na", "undefined", "not specified", "not stated", "not provided"]);

/**
 * Returns the trimmed text, or undefined when it is empty or just the AI saying "nothing"
 * ("null", ": null", "N/A"). Whole-value match only, so real sentences are never touched.
 */
export const cleanText = (value: string | null | undefined): string | undefined => {
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    if (!trimmed) return undefined;

    const normalised = trimmed
        .replace(/^[\s:;,.\-–—]+/, "")
        .replace(/[\s.]+$/, "")
        .toLowerCase();

    return normalised === "" || EMPTY_ANSWERS.has(normalised) ? undefined : trimmed;
};