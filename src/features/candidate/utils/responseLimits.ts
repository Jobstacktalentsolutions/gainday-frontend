/** Words in a response, split on whitespace. A blank response has no words. */
export function countWords(text: string): number {
    const trimmed = text.trim();
    return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

export type LimitState = "ok" | "warning" | "atLimit";

/** Where a count sits against its limit: a soft warning from 90%, and at the limit once it is reached. */
export function limitState(count: number, max: number): LimitState {
    if (count >= max) return "atLimit";
    if (count >= max * 0.9) return "warning";
    return "ok";
}

/** Tailwind classes for a counter: red once the limit is reached, so people can see they are capped. */
export function limitTextClass(state: LimitState): string {
    return state === "atLimit" ? "font-medium text-error-600" : "";
}

/**
 * Cuts a response back to the word cap. Typing or pasting past it stops
 * at the cap instead of letting the response grow over it.
 */
export function capResponse(text: string, maxWords: number): string {
    let words = 0;
    for (const match of text.matchAll(/\S+/g)) {
        words += 1;
        if (words === maxWords) {
            return text.slice(0, (match.index ?? 0) + match[0].length);
        }
    }
    return text;
}
