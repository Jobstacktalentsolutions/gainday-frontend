import { describe, it, expect } from "vitest";
import {
    isDeadlineAfterToday,
    getTomorrowDateString,
    jobDetailsSchema,
} from "./jobPosting";

describe("deadline validation", () => {
    it("returns true for empty or undefined deadline", () => {
        expect(isDeadlineAfterToday(undefined)).toBe(true);
        expect(isDeadlineAfterToday("")).toBe(true);
        expect(isDeadlineAfterToday(null)).toBe(true);
    });

    it("returns true for future dates", () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
        const dd = String(tomorrow.getDate()).padStart(2, "0");
        const tomorrowStr = `${yyyy}-${mm}-${dd}`;

        expect(isDeadlineAfterToday(tomorrowStr)).toBe(true);
        expect(isDeadlineAfterToday("2099-12-31")).toBe(true);
    });

    it("returns false for today's date", () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const todayStr = `${yyyy}-${mm}-${dd}`;

        expect(isDeadlineAfterToday(todayStr)).toBe(false);
    });

    it("returns false for past dates", () => {
        expect(isDeadlineAfterToday("2020-01-01")).toBe(false);
    });

    it("getTomorrowDateString returns a valid YYYY-MM-DD date", () => {
        const tomorrow = getTomorrowDateString();
        expect(tomorrow).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(isDeadlineAfterToday(tomorrow)).toBe(true);
    });

    it("jobDetailsSchema fails with expected message if deadline is today or in past", () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const todayStr = `${yyyy}-${mm}-${dd}`;

        const invalidValues = {
            title: "Frontend Engineer",
            role: "Engineering",
            skillLevel: "Senior",
            company: "Gainday Inc",
            location: "Remote",
            employmentType: "Full-time",
            description: "A".repeat(50),
            deadline: todayStr,
        };

        const result = jobDetailsSchema.safeParse(invalidValues);
        expect(result.success).toBe(false);
        if (!result.success) {
            const deadlineIssue = result.error.issues.find((i) => i.path.includes("deadline"));
            expect(deadlineIssue).toBeDefined();
            expect(deadlineIssue?.message).toBe("Deadline must be greater than current day");
        }
    });

    it("jobDetailsSchema succeeds if deadline is in the future", () => {
        const future = new Date();
        future.setDate(future.getDate() + 10);
        const yyyy = future.getFullYear();
        const mm = String(future.getMonth() + 1).padStart(2, "0");
        const dd = String(future.getDate()).padStart(2, "0");
        const futureStr = `${yyyy}-${mm}-${dd}`;

        const validValues = {
            title: "Frontend Engineer",
            role: "Engineering",
            skillLevel: "Senior",
            company: "Gainday Inc",
            location: "Remote",
            employmentType: "Full-time",
            description: "A".repeat(50),
            deadline: futureStr,
        };

        const result = jobDetailsSchema.safeParse(validValues);
        expect(result.success).toBe(true);
    });
});
