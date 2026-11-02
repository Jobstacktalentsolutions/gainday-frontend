import type { JobSalaryRange } from "../types/jobBoard";


const isPositive = (n: number | null | undefined): n is number => typeof n === "number" && n > 0;

/** True only when the employer actually entered a salary. 0 and null both mean "not provided". */
export function hasSalary({ min, max }: JobSalaryRange): boolean {
  return isPositive(min) || isPositive(max);
}

export function formatSalaryRange({ min, max, currency }: JobSalaryRange): string {
  const low = isPositive(min) ? min : undefined;
  const high = isPositive(max) ? max : undefined;
  if (low === undefined && high === undefined) return "Not disclosed";

  const targetCurrency = currency === "USD" || !currency ? "GBP" : currency;
  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: targetCurrency,
    maximumFractionDigits: 0,
  });

  if (low !== undefined && high !== undefined) return `${formatter.format(low)} - ${formatter.format(high)}`;
  return formatter.format((low ?? high) as number);
}

export function formatPostedDate(isoDate: string | null): string {
  if (!isoDate) return "Not set";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}