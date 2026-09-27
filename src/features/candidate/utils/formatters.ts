import type { JobSalaryRange } from "../types/jobBoard";


export function formatSalaryRange({ min, max, currency }: JobSalaryRange): string {
  if (min == null && max == null) return "Not disclosed";

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  if (min != null && max != null) return `${formatter.format(min)} - ${formatter.format(max)}`;
  return formatter.format(min ?? max ?? 0);
}

export function formatPostedDate(isoDate: string | null): string {
  if (!isoDate) return "Not set";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}