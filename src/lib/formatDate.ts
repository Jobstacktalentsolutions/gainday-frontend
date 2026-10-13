const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Built by hand rather than with toLocaleDateString("en-GB") because newer browsers render
// September as "Sept" there, whereas the design system uses "Sep". e.g. "26 Sep 2026".
export const formatShortDate = (iso: string): string => {
    const date = new Date(iso);
    const day = String(date.getDate()).padStart(2, "0");
    return `${day} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};