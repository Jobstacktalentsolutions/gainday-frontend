import type {
    JobSubmissionsData,
    SubmissionDetail,
    SubmissionSummary,
    TaskResult,
} from "../types/submission";

const MOCK_JOB_TITLE = "Custody Operations Analyst";

const MOCK_SUBMISSIONS: SubmissionSummary[] = [
    {
        id: "sub-1",
        candidateName: "Zainab Bello",
        displayId: "GD-4809",
        overallScore: 88,
        categoryScores: { problemSolving: 63, judgmentExecution: 75, writtenCommunication: 88, commercialDomainAwareness: 92 },
        capabilityScore: 748,
        capabilityDelta: 86,
        attemptCount: 2,
        timeTakenSeconds: 19 * 60,
        submittedAt: "2026-09-24T10:12:00.000Z",
        integrityStatus: "CLEAN",
    },
    {
        id: "sub-2",
        candidateName: "Jared Kim",
        displayId: "GD-4812",
        overallScore: 90,
        categoryScores: { problemSolving: 72, judgmentExecution: 79, writtenCommunication: 87, commercialDomainAwareness: 91 },
        capabilityScore: 740,
        capabilityDelta: 80,
        attemptCount: 2,
        timeTakenSeconds: 18 * 60,
        submittedAt: "2026-09-23T14:40:00.000Z",
        integrityStatus: "CLEAN",
    },
    {
        id: "sub-3",
        candidateName: "Amir Hassan",
        displayId: "GD-4810",
        overallScore: 92,
        categoryScores: { problemSolving: 70, judgmentExecution: 80, writtenCommunication: 90, commercialDomainAwareness: 94 },
        capabilityScore: 765,
        capabilityDelta: 102,
        attemptCount: 3,
        timeTakenSeconds: 22 * 60,
        submittedAt: "2026-09-25T09:05:00.000Z",
        integrityStatus: "MINOR_FLAGS",
    },
    {
        id: "sub-4",
        candidateName: "Lara Nguyen",
        displayId: "GD-4923",
        overallScore: 85,
        categoryScores: { problemSolving: 78, judgmentExecution: 88, writtenCommunication: 92, commercialDomainAwareness: 89 },
        capabilityScore: 812,
        capabilityDelta: 150,
        attemptCount: 4,
        timeTakenSeconds: 19 * 60,
        submittedAt: "2026-10-02T16:30:00.000Z",
        integrityStatus: "CLEAN",
    },
    {
        id: "sub-5",
        candidateName: "David Kim",
        displayId: "GD-4758",
        overallScore: 90,
        categoryScores: { problemSolving: 65, judgmentExecution: 79, writtenCommunication: 85, commercialDomainAwareness: 91 },
        capabilityScore: 780,
        capabilityDelta: 98,
        attemptCount: 2,
        timeTakenSeconds: 24 * 60,
        submittedAt: "2026-10-05T11:20:00.000Z",
        integrityStatus: "PENDING",
    },
    {
        id: "sub-6",
        candidateName: "Leila Morgan",
        displayId: "GD-4811",
        overallScore: 85,
        categoryScores: { problemSolving: 68, judgmentExecution: 78, writtenCommunication: 85, commercialDomainAwareness: 89 },
        capabilityScore: 732,
        capabilityDelta: 74,
        attemptCount: 1,
        timeTakenSeconds: 20 * 60,
        submittedAt: "2026-09-24T08:50:00.000Z",
        integrityStatus: "REVIEW_NEEDED",
    },
];

// The four signals the candidate simulation actually records (fullscreen-exit, tab-hidden,
// window-blur, idle — see TaskRunner / useSimulationIntegrityStore).
const MOCK_INTEGRITY_CHECKS = [
    "Full-screen enforced",
    "Tab-switch monitoring",
    "Window-focus monitoring",
    "Idle detection",
];

const TASK_TEMPLATES: Omit<TaskResult, "taskId" | "score">[] = [
    {
        taskNumber: 1,
        title: "Settlement Instruction Review",
        evidence:
            "Identified value-date mismatch (T+2 vs T+1) and BIC branch suffix; confirmed ISIN match; held instruction pending dealer amendment.",
    },
    {
        taskNumber: 2,
        title: "Trade Confirmation Verification",
        evidence:
            "Detected discrepancies in trade amount and currency; cross-checked with trade blotter; flagged for compliance review.",
    },
    {
        taskNumber: 3,
        title: "Portfolio Risk Assessment",
        evidence:
            "Analyzed exposure across sectors; identified concentration risk in tech stocks; recommended diversification strategies to mitigate volatility.",
    },
    {
        taskNumber: 4,
        title: "Market Trend Analysis",
        evidence:
            "Conducted comparative study of emerging markets; highlighted growth opportunities in Southeast Asia; suggested timing for market entry based on economic indicators.",
    },
];

const BASE_TASK_SCORES = [78, 85, 92, 85];
const clampScore = (value: number) => Math.min(100, Math.max(0, Math.round(value)));

// Oldest → newest, ending on the current score and rising by `delta` overall.
const buildCapabilityHistory = (current: number, delta: number, attempts: number): number[] => {
    if (attempts <= 1) return [current];
    return Array.from({ length: attempts }, (_, index) =>
        Math.round(current - (delta * (attempts - 1 - index)) / (attempts - 1)),
    );
};

const toDetail = (jobId: string, summary: SubmissionSummary): SubmissionDetail => {
    const offset = summary.overallScore - 82;
    return {
        id: summary.id,
        jobId,
        candidateName: summary.candidateName,
        displayId: summary.displayId,
        overallScore: summary.overallScore,
        submittedAt: summary.submittedAt,
        integrityStatus: summary.integrityStatus,
        tasks: TASK_TEMPLATES.map((template, index) => ({
            ...template,
            taskId: `${summary.id}-task-${template.taskNumber}`,
            score: clampScore(BASE_TASK_SCORES[index] + offset),
        })),
        // Contact stays null until the unlock/payment flow exists.
        contact: null,
        isUnlocked: false,
        capabilityHistory: buildCapabilityHistory(summary.capabilityScore, summary.capabilityDelta, summary.attemptCount),
        integrityChecks: MOCK_INTEGRITY_CHECKS,
    };
};

export const getMockJobSubmissions = (): JobSubmissionsData => ({
    jobTitle: MOCK_JOB_TITLE,
    submissions: MOCK_SUBMISSIONS,
});

export const getMockSubmissionDetail = (jobId: string, submissionId: string): SubmissionDetail | null => {
    const summary = MOCK_SUBMISSIONS.find((submission) => submission.id === submissionId);
    return summary ? toDetail(jobId, summary) : null;
};