import type { CandidatePassport, CapabilityPassportSummary } from "../types/passport";

const MOCK_PASSPORT: CandidatePassport = {
    compositeScore: 720,
    compositeDelta: 18,
    verifiedSimulationCount: 4,
    lastUpdated: "2026-09-26T09:00:00.000Z",
    history: [668, 703, 721, 739],
    dimensions: {
        problemSolving: 84,
        judgmentExecution: 77,
        writtenCommunication: 88,
        commercialDomainAwareness: 68,
    },
    domains: [
        { id: "custody-settlement", name: "Custody & Settlement", simulationCount: 2, score: 82 },
        { id: "risk-management", name: "Risk Management", simulationCount: 1, score: 74 },
        { id: "fund-accounting", name: "Fund Accounting", simulationCount: 1, score: 69 },
        { id: "payments-operations", name: "Payments Operations", simulationCount: 1, score: 86 },
    ],
    // Deliberately pronoun-free so it reads correctly for both the candidate and an employer.
    whatStoodOut:
        "Prioritized the client escalation correctly ahead of routine requests in the morning inbox task and explained the reasoning clearly. The response to the stakeholder pushback was direct and confident. The area with the most room to grow is tying recommendations back to cost trade-offs when time is short.",
    improvementSuggestions: [
        {
            id: "judgmentExecution",
            area: "judgmentExecution",
            text: "State the next concrete action and its deadline in every escalation.",
        },
        {
            id: "problemSolving",
            area: "problemSolving",
            text: "Quantify exposure (amount, units, cutoff time) before recommending a hold or release.",
        },
        {
            id: "writtenCommunication",
            area: "writtenCommunication",
            text: "Keep client notes under 100 words and lead with the outcome.",
        },
        {
            id: "commercialDomainAwareness",
            area: "commercialDomainAwareness",
            text: "Name the cost or revenue impact of each recommendation, not only the operational fix.",
        },
        {
            id: "overall",
            area: "OVERALL",
            text: "Commercial & domain awareness is your lowest scoring category at 68. In your next simulation, try naming the cost or revenue impact of a recommendation directly, not just the operational fix. Your Accounting-domain result (Fund Accounting Analyst, 69/100) trails your Operations work. Completing another Accounting-focused simulation would strengthen that specific role-strength rating.",
        },
    ],
};

// Resolves to null for a candidate with no scored simulations yet.
export const getMockCandidatePassport = (): CandidatePassport | null => MOCK_PASSPORT;

// The employer-facing view: the same data with the candidate-only coaching stripped out.
export const getMockPassportSummary = (): CapabilityPassportSummary => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { improvementSuggestions, ...summary } = MOCK_PASSPORT;
    return summary;
};