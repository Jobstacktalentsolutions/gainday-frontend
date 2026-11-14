import { describe, expect, it } from "vitest";
import { InterfaceType } from "@/features/simulation-tasks/types";
import { JOB_DESCRIPTION_MIN } from "../schemas/jobPosting";
import type { BackendJobWithSimulation } from "../types/job";
import { getResumeStep } from "./resumeStep";

const task = {
    id: "t1",
    questionBankId: null,
    taskType: "x",
    category: "c",
    title: "Task",
    scenarioDescription: "s",
    questionPrompt: "q",
    businessProblemDerived: false,
    interfaceType: Object.values(InterfaceType)[0], // if InterfaceType is a numeric enum, pick a member directly
    interfacePayload: {},
};

const draft = (overrides: Record<string, unknown> = {}) =>
    ({
        title: "Account Executive",
        role: "Sales",
        skillLevel: "Mid",
        skillCategory: null,
        location: "London, UK",
        employmentType: "Full-time",
        applicationDeadline: null,
        isRemoteFriendly: false,
        salaryRange: null,
        companyDescription: null,
        requiredSkills: [],
        description: "x".repeat(JOB_DESCRIPTION_MIN),
        businessProblem: null,
        simulation: null,
        ...overrides,
    }) as unknown as BackendJobWithSimulation;

describe("getResumeStep", () => {
    it("starts at details when required details are missing", () => {
        expect(getResumeStep(draft({ title: "" }))).toBe("details");
    });

    it("returns to details when the saved deadline is already past", () => {
        expect(getResumeStep(draft({ applicationDeadline: "2020-01-01T00:00:00.000Z" }))).toBe("details");
    });

    it("goes to the simulation builder when details are done but there are no tasks", () => {
        expect(getResumeStep(draft())).toBe("simulation-builder");
    });

    it("goes to review when details and tasks are complete", () => {
        expect(getResumeStep(draft({ simulation: { tasks: [task] } }))).toBe("review");
    });
});

