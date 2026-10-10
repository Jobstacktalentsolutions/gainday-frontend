const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Built by hand rather than with toLocaleDateString("en-GB") because newer browsers render
// September as "Sept" there, whereas the design uses "Sep".
export const formatSubmittedDate = (iso: string): string => {
    const date = new Date(iso);
    const day = String(date.getDate()).padStart(2, "0");
    return `${day} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatDuration = (seconds: number): string => {
    const totalMinutes = Math.max(1, Math.round(seconds / 60));
    if (totalMinutes < 60) return `${totalMinutes}m`;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
};

export const formatCapabilityDelta = (delta: number): string => (delta > 0 ? `+${delta}` : String(delta));

export const formatAttempts = (count: number): string => `${count} attempt${count === 1 ? "" : "s"}`;