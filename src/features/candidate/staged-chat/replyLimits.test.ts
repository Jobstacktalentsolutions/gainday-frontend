import { describe, expect, it } from "vitest";
import { countWords, limitState } from "./replyLimits";

describe("countWords", () => {
    it("counts words split on any whitespace, and none for a blank reply", () => {
        expect(countWords("  one two\nthree  ")).toBe(3);
        expect(countWords("   ")).toBe(0);
        expect(countWords("")).toBe(0);
    });
});

describe("limitState", () => {
    it("is ok below 90% of the limit, warns from 90%, and is over above the limit", () => {
        expect(limitState(80, 100)).toBe("ok");
        expect(limitState(90, 100)).toBe("warning");
        expect(limitState(100, 100)).toBe("warning");
        expect(limitState(101, 100)).toBe("over");
    });
});
