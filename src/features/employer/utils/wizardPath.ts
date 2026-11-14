const WIZARD_BASE = "/employer/jobs/new";

export type WizardStep = "details" | "simulation-builder" | "review";

export function wizardPath(step: WizardStep, postId: string): string {
    return `${WIZARD_BASE}/${step}?${new URLSearchParams({ postId })}`;
}
