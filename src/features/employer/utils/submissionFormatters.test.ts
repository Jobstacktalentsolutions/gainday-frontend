import { describe, expect, it } from "vitest"
import { formatDuration, formatSubmittedDate } from "./submissionFormatters"

describe("formatDuration", () => {
    it.each([
        [19 * 60, "19m"],
        [30, "1m"],
        [60 * 60, "1h"],
        [75 * 60, "1h 15m"],
    ])("%i seconds -> %s", (seconds, expected) => {
        expect(formatDuration(seconds)).toBe(expected)
    })
})

describe("formatSubmittedDate", () => {
    it("uses 'Sep', not the 'Sept' newer browsers print for en-GB", () => {
        // Midday UTC so the local date is the same in every timezone from -12 to +11.
        expect(formatSubmittedDate("2026-09-03T12:00:00Z")).toBe("03 Sep 2026")
    })
})