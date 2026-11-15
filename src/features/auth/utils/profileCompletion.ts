import { AUTH_ROLES } from "./roles";
import type { AuthUser } from "../store/authStore";

export const getMissingProfileFields = (user: AuthUser): string[] => {
  if (user.role !== AUTH_ROLES.employer && user.role !== AUTH_ROLES.candidate) return [];
  const missing: string[] = [];
  if (user.role === AUTH_ROLES.candidate && !user.title?.trim()) missing.push("job title");
  if (!user.phoneNumber?.trim()) missing.push("phone number");
  return missing;
};
