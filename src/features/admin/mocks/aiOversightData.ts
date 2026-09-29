import type { GeneratedSimulation, FailedScoringSubmission } from "../types/aiOversight";

export const mockGeneratedSimulations: GeneratedSimulation[] = [
    {
        id: "sim_1",
        jobTitle: "Custody Operations Business Manager",
        taskCount: 4,
        status: "live",
        generatedAt: "2026-09-25T10:15:00Z",
        jobId: "job_1",
    },
    {
        id: "sim_2",
        jobTitle: "Finance Associate",
        taskCount: 4,
        status: "live",
        generatedAt: "2026-09-26T14:30:00Z",
        jobId: "job_2",
    },
    {
        id: "sim_3",
        jobTitle: "Sales Analyst",
        taskCount: 3,
        status: "draft",
        generatedAt: "2026-09-27T09:00:00Z",
        jobId: "job_3",
    },
    {
        id: "sim_4",
        jobTitle: "Product Manager",
        taskCount: 5,
        status: "archived",
        generatedAt: "2026-09-20T11:00:00Z",
        jobId: "job_4",
    },
];

export const mockFailedScoringSubmissions: FailedScoringSubmission[] = [
    {
        id: "fail_1",
        candidateId: "cand_5512",
        candidateNumber: "5512",
        jobTitle: "Sales Analyst",
        failureReason: "Scoring timeout — Task 3 response too long",
        failedTaskIndex: 2,
        status: "failed",
        occurredAt: "2026-09-29T08:22:00Z",
    },
    {
        id: "fail_2",
        candidateId: "cand_4891",
        candidateNumber: "4891",
        jobTitle: "Finance Associate",
        failureReason: "AI model returned null score for Task 2",
        failedTaskIndex: 1,
        status: "retrying",
        occurredAt: "2026-09-28T16:45:00Z",
    },
    {
        id: "fail_3",
        candidateId: "cand_3302",
        candidateNumber: "3302",
        jobTitle: "Custody Operations Business Manager",
        failureReason: "Rate limit exceeded during batch scoring",
        failedTaskIndex: 0,
        status: "resolved",
        occurredAt: "2026-09-27T12:10:00Z",
    },
];
