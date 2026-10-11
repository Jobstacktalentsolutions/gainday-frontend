import type { CategoryKey } from "../types/passport";

// Display order for the four backend categories. `short` is the employer table's abbreviation.
export const CATEGORY_ORDER: { key: CategoryKey; label: string; short: string }[] = [
    { key: "problemSolving", label: "Problem solving", short: "PS" },
    { key: "judgmentExecution", label: "Judgment & execution", short: "JE" },
    { key: "writtenCommunication", label: "Written communication", short: "WC" },
    { key: "commercialDomainAwareness", label: "Commercial & domain awareness", short: "CD" },
];

export const PASSPORT_MAX_SCORE = 1000;

export const formatSimulationCount = (count: number): string =>
    `${count} SIMULATION${count === 1 ? "" : "S"}`;