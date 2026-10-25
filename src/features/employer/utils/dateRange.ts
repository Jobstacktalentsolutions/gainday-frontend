import type { FilterOption } from "@/features/candidate/types/jobBoard";

export const DATE_PRESET_OPTIONS: FilterOption[] = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "year", label: "This year" },
];

const DAY_MS = 86_400_000;
const PRESET_DAYS: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };

export const isWithinDatePreset = (iso: string, preset: string | null, now: Date = new Date()): boolean => {
    if (!preset) return true;
    const date = new Date(iso);
    if (preset === "year") return date.getFullYear() === now.getFullYear();
    return now.getTime() - date.getTime() <= (PRESET_DAYS[preset] ?? Infinity) * DAY_MS;
};