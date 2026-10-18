// Mirrors gainday-backend/src/modules/capability-passport/capability-passport.types.ts exactly —
// GET /capability-passport/me and GET /submissions/:id/passport return these shapes directly, no
// mapping layer on either side.

// Mirrors the four keys of the backend's CategoryScores (see CURRENT_SCHEMA.md).
export type CategoryKey =
    | "problemSolving"
    | "judgmentExecution"
    | "writtenCommunication"
    | "commercialDomainAwareness";

export type CategoryScores = Record<CategoryKey, number>;

export interface PassportDomain {
    id: string;
    name: string;
    simulationCount: number;
    /** 0–100 */
    score: number;
}

// What both the candidate and an employer may see.
export interface CapabilityPassportSummary {
    /** Out of PASSPORT_MAX_SCORE. */
    compositeScore: number;
    /** Change since the previous simulation. */
    compositeDelta: number;
    verifiedSimulationCount: number;
    /** ISO 8601 */
    lastUpdated: string;
    /** Composite score after each simulation, oldest first. */
    history: number[];
    /** Each 0–100. */
    dimensions: CategoryScores;
    domains: PassportDomain[];
    /** One neutral-voice string, shown to both candidate and employer. */
    whatStoodOut: string;
}

export interface ImprovementSuggestion {
    id: string;
    area: CategoryKey | "OVERALL";
    text: string;
}

// Candidate-only: employers never receive improvement suggestions.
export interface CandidatePassport extends CapabilityPassportSummary {
    improvementSuggestions: ImprovementSuggestion[];
}