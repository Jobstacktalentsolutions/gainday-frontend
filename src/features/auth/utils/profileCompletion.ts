import { AUTH_ROLES } from "./roles";
import type { AuthUser } from "../store/authStore";

export const getMissingProfileFields = (user: AuthUser): string[] => {
  if (user.role !== AUTH_ROLES.employer && user.role !== AUTH_ROLES.candidate) return [];
  const missing: string[] = [];
  if (user.role === AUTH_ROLES.candidate && !user.title?.trim()) missing.push("job title");
  if (!user.phoneNumber?.trim()) missing.push("phone number");
  return missing;
};

/** Copy for the profile page banner. Names exactly what's missing. */
export const getProfileWarning = (missing: string[]): string | null => {
  if (missing.length === 0) return null;
  const base = `Add your ${missing.join(" and ")} to complete your profile.`;
  return missing.includes("job title") ? `${base} You need a job title to apply for jobs.` : base;
};