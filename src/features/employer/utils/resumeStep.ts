import { jobDetailsSchema, simulationBuilderSchema } from "../schemas/jobPosting";
import type { BackendJobWithSimulation } from "../types/job";
import { jobToFormValues } from "./jobFormValues";
import type { WizardStep } from "./wizardPath";

/** Where "Continue editing" should land: the first wizard step the saved draft doesn't yet satisfy. */
export const getResumeStep = (job: BackendJobWithSimulation): WizardStep => {
    // `company` isn't stored on the job (the details step fills it from the employer profile), so a
    // stand-in keeps that one rule from failing; every other rule runs against the saved values.
    const details = jobDetailsSchema.safeParse({ ...jobToFormValues(job), company: "-" });
    if (!details.success) return "details";

    const simulation = simulationBuilderSchema.safeParse({ tasks: job.simulation?.tasks ?? [] });
    return simulation.success ? "review" : "simulation-builder";
};

export default getResumeStep;