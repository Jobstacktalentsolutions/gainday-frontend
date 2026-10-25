// Dashboard each signed-in role lands on. Job seekers start on the job board.
export const ROLE_DASHBOARD_PATHS: Record<string, string> = {
    EMPLOYER: "/employer/jobs",
    JOB_SEEKER: "/job-board",
    ADMIN: "/admin/overview",
};

// Paths each role is allowed to see. Matches the route guards, so a redirect outside these would
// be bounced anyway.
const ROLE_AREAS: Record<string, string[]> = {
    EMPLOYER: ["/employer"],
    JOB_SEEKER: ["/candidate", "/job-board"],
    ADMIN: ["/admin"],
};

const isWithinArea = (path: string, area: string) =>
    path === area || path.startsWith(`${area}/`);

/**
 * Where to send someone after they sign in. A `?redirect=` is used only when it is a same-site path
 * inside that role's own area; anything else falls back to the role's dashboard.
 */
export function resolvePostLoginPath(role: string, redirect: string | null): string {
    const dashboard = ROLE_DASHBOARD_PATHS[role];
    if (!dashboard) return "/landing";

    const areas = ROLE_AREAS[role] ?? [];
    const isSafe =
        redirect !== null &&
        redirect.startsWith("/") &&
        !redirect.startsWith("//") &&
        areas.some((area) => isWithinArea(redirect, area));

    return isSafe ? redirect : dashboard;
}
