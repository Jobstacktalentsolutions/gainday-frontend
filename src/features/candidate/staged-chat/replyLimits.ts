/** Words in a reply, split on whitespace. An empty or blank reply has no words. */
export function countWords(text: string): number {
    const trimmed = text.trim();
    return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

export type LimitState = "ok" | "warning" | "over";

/** Where a word count sits against the limit: a soft warning from 90% of it, and over the limit. */
export function limitState(count: number, max: number): LimitState {
    if (count > max) return "over";
    if (count >= max * 0.9) return "warning";
    return "ok";
}
