const WIZARD_BASE = "/employer/jobs/new";

export function wizardPath(step: "details" | "simulation-builder" | "review", postId: string): string {
    return `${WIZARD_BASE}/${step}?${new URLSearchParams({ postId })}`;
}
