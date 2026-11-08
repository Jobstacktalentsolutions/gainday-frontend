import { describe, expect, it } from "vitest";
import { capResponse, countWords, limitState } from "./responseLimits";

describe("countWords", () => {
    it("counts words split on any whitespace, and none for a blank response", () => {
        expect(countWords("  one two\nthree  ")).toBe(3);
        expect(countWords("   ")).toBe(0);
        expect(countWords("")).toBe(0);
    });
});

describe("limitState", () => {
    it("is ok below 90% of the limit, warns from 90%, and is at the limit once reached", () => {
        expect(limitState(80, 100)).toBe("ok");
        expect(limitState(90, 100)).toBe("warning");
        expect(limitState(99, 100)).toBe("warning");
        expect(limitState(100, 100)).toBe("atLimit");
    });
});

describe("capResponse", () => {
    it("leaves a response within both limits unchanged", () => {
        expect(capResponse("one two three", 3)).toBe("one two three");
    });

    it("cuts a response at the word limit, keeping the text before it", () => {
        expect(capResponse("one  two three four", 2)).toBe("one  two");
    });
});
