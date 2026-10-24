import { describe, expect, it } from "vitest"
import { DEFAULT_SORT, sortSubmissions } from "./submissionSort"
import type { SubmissionSummary } from "../types/submission"

// Only the fields the sort reads; cast so the test doesn't break when unrelated fields change.
const row = (fields: Partial<SubmissionSummary>) =>
    ({
        capabilityScore: 700,
        overallScore: 80,
        submittedAt: "2026-09-24T10:00:00.000Z",
        integrityStatus: "CLEAN",
        ...fields,
    }) as SubmissionSummary

const names = (list: SubmissionSummary[]) => list.map((item) => item.candidateName)

const rows = [
    row({ candidateName: "Low", capabilityScore: 650, submittedAt: "2026-09-20T10:00:00.000Z", integrityStatus: "REVIEW_NEEDED" }),
    row({ candidateName: "High", capabilityScore: 800, submittedAt: "2026-10-02T10:00:00.000Z", integrityStatus: "CLEAN" }),
    row({ candidateName: "Mid", capabilityScore: 720, submittedAt: "2026-09-25T10:00:00.000Z", integrityStatus: "MINOR_FLAGS" }),
]

describe("sortSubmissions", () => {
    it("defaults to highest capability score first", () => {
        expect(DEFAULT_SORT).toEqual({ key: "capabilityScore", direction: "desc" })
        expect(names(sortSubmissions(rows, DEFAULT_SORT))).toEqual(["High", "Mid", "Low"])
    })

    it("sorts ascending and by date", () => {
        expect(names(sortSubmissions(rows, { key: "capabilityScore", direction: "asc" }))).toEqual(["Low", "Mid", "High"])
        expect(names(sortSubmissions(rows, { key: "submittedAt", direction: "desc" }))).toEqual(["High", "Mid", "Low"])
    })

    it("ranks integrity from cleanest to most flagged", () => {
        expect(names(sortSubmissions(rows, { key: "integrity", direction: "asc" }))).toEqual(["High", "Mid", "Low"])
        expect(names(sortSubmissions(rows, { key: "integrity", direction: "desc" }))).toEqual(["Low", "Mid", "High"])
    })

    it("breaks ties by overall score, then name, and never mutates the input", () => {
        const tied = [
            row({ candidateName: "Beta", overallScore: 70 }),
            row({ candidateName: "Alpha", overallScore: 70 }),
            row({ candidateName: "Top", overallScore: 90 }),
        ]
        const snapshot = names(tied)
        expect(names(sortSubmissions(tied, DEFAULT_SORT))).toEqual(["Top", "Alpha", "Beta"])
        expect(names(tied)).toEqual(snapshot)
    })
})