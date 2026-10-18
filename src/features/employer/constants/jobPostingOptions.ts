export const ROLES = [
    { value: "FINANCE", label: "Finance" },
    { value: "SALES", label: "Sales" },
    { value: "OPERATIONS", label: "Operations" },
    { value: "ENGINEERING", label: "Engineering" },
    { value: "PRODUCT", label: "Product" },
    { value: "MARKETING", label: "Marketing" },
    { value: "CUSTOMER_SUCCESS", label: "Customer Success" },
    { value: "LEGAL_COMPLIANCE", label: "Legal & Compliance" },
    { value: "HR_PEOPLE", label: "HR & People" },
];

export const SKILL_LEVELS = ["Entry level", "Mid level", "Senior level"];

export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract"];

export const AI_USE_POLICIES = [
    "No AI assistance permitted",
    "Limited AI assistance permitted",
    "Open AI assistance permitted",
];

// Mirrors gainday-backend's generationConfig.defaultSimulationTimeLimitMinutes. Used only as a
// brief fallback before the real per-job value (job.simulation.timeLimitMinutes) has loaded —
// the backend value is always the source of truth once available.
export const DEFAULT_SIMULATION_TIME_LIMIT_MINUTES = 30;