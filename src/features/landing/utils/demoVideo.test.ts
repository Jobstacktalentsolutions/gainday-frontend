import { describe, expect, it } from "vitest";
import { CANDIDATE_SEGMENT, formatTime } from "./demoVideo";

describe("formatTime", () => {
    it("formats seconds as m:ss", () => {
        expect(formatTime(0)).toBe("0:00");
        expect(formatTime(9.9)).toBe("0:09");
        expect(formatTime(65)).toBe("1:05");
        expect(formatTime(600)).toBe("10:00");
    });

    it("copes with values that are not ready yet", () => {
        expect(formatTime(Number.NaN)).toBe("0:00");
        expect(formatTime(Infinity)).toBe("0:00");
        expect(formatTime(-3)).toBe("0:00");
    });
});

describe("CANDIDATE_SEGMENT", () => {
    it("is 28.5 seconds long", () => {
        expect(CANDIDATE_SEGMENT.end - CANDIDATE_SEGMENT.start).toBe(28.5);
    });
});
