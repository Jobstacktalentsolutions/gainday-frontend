export type AdminRole = "SUPER_ADMIN" | "MANAGER" | "MODERATOR";

export interface NavItemConfig {
  to: string;
  label: string;
  icon: any;
  allowedRoles?: AdminRole[];
}

export interface NavGroupConfig {
  id: string;
  label: string;
  icon: any;
  items: NavItemConfig[];
}

/**
 * Route-to-allowed-roles mapping for admin console
 */
export const ADMIN_ROUTE_PERMISSIONS: Record<string, AdminRole[]> = {
  "/admin/dashboard": ["SUPER_ADMIN", "MANAGER", "MODERATOR"],
  "/admin/employer-management": ["SUPER_ADMIN", "MANAGER"],
  "/admin/candidate-management": ["SUPER_ADMIN", "MANAGER"],
  "/admin/admin-management": ["SUPER_ADMIN"],
  "/admin/content-moderation": ["SUPER_ADMIN", "MANAGER", "MODERATOR"],
  "/admin/generation-reviews": ["SUPER_ADMIN", "MANAGER", "MODERATOR"],
  "/admin/ai-oversight": ["SUPER_ADMIN", "MANAGER", "MODERATOR"],
};

/**
 * Checks if a given admin role is authorized for a specific route path
 */
export function isRouteAllowedForRole(pathname: string, role?: string, isSuperAdmin?: boolean): boolean {
  if (isSuperAdmin || role === "SUPER_ADMIN") return true;
  
  const effectiveRole = (role as AdminRole) || "MANAGER";

  // Match the closest base route
  for (const [route, allowed] of Object.entries(ADMIN_ROUTE_PERMISSIONS)) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      return allowed.includes(effectiveRole);
    }
  }

  // By default, allow dashboard / generic admin pages
  return true;
}

/**
 * Helper to check capability permissions
 */
export function canManageAdmins(role?: string, isSuperAdmin?: boolean): boolean {
  return isSuperAdmin === true || role === "SUPER_ADMIN";
}

export function canManageUsers(role?: string, isSuperAdmin?: boolean): boolean {
  if (isSuperAdmin || role === "SUPER_ADMIN") return true;
  return role === "MANAGER";
}

export function canSuspendAccounts(role?: string, isSuperAdmin?: boolean): boolean {
  if (isSuperAdmin || role === "SUPER_ADMIN") return true;
  return role === "MANAGER";
}
