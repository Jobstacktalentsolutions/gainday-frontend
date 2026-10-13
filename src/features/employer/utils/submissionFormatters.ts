export { formatShortDate as formatSubmittedDate } from "@/lib/formatDate";

export const formatDuration = (seconds: number): string => {
    const totalMinutes = Math.max(1, Math.round(seconds / 60));
    if (totalMinutes < 60) return `${totalMinutes}m`;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
};

export const formatCapabilityDelta = (delta: number): string => (delta > 0 ? `+${delta}` : String(delta));

export const formatAttempts = (count: number): string => `${count} attempt${count === 1 ? "" : "s"}`;