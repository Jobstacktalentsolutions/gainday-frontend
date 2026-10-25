export interface WaterfallStep {
    category: string;
    /** Where the visible bar starts on the value axis (the invisible base). */
    base: number;
    /** The visible bar's height. Always positive. */
    height: number;
    kind: "total" | "increase" | "decrease";
    /** The value as stated, signed, for the tooltip. */
    value: number;
}

/**
 * Turns a bridge into the floating bars of a waterfall. A total starts from zero; each other step starts
 * where the previous one ended, so the bars join up. Pure, so the arithmetic is tested directly.
 */
export function waterfallSteps(categories: string[], values: number[], totals: boolean[]): WaterfallStep[] {
    let running = 0;
    return categories.map((category, index) => {
        const value = values[index];
        if (totals[index]) {
            running = value;
            return { category, base: 0, height: Math.abs(value), kind: "total", value };
        }
        const start = running;
        const end = running + value;
        running = end;
        return {
            category,
            base: Math.min(start, end),
            height: Math.abs(value),
            kind: value >= 0 ? "increase" : "decrease",
            value,
        };
    });
}
