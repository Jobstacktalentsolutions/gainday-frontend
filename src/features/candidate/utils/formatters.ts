import type { JobSalaryRange } from "../types/jobBoard";


export function formatSalaryRange({ min, max, currency }: JobSalaryRange): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
 
  return `${formatter.format(min)} - ${formatter.format(max)}`;
}

export function formatPostedDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}