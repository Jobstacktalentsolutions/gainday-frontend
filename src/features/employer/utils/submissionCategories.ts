import type { CategoryKey } from "../types/submission";

// Display order for the four backend categories. `short` is the table column's abbreviation.
export const CATEGORY_ORDER: { key: CategoryKey; label: string; short: string }[] = [
    { key: "problemSolving", label: "Problem solving", short: "PS" },
    { key: "judgmentExecution", label: "Judgment & execution", short: "JE" },
    { key: "writtenCommunication", label: "Written communication", short: "WC" },
    { key: "commercialDomainAwareness", label: "Commercial & domain awareness", short: "CD" },
];