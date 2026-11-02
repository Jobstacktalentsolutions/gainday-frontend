import type { JobPostingFormInput } from "../schemas/jobPosting";
import type { BackendJobWithSimulation } from "../types/job";

// Maps a saved job onto the wizard form. This is the one place that decides how a nullable column
// is shown in the form: a null column becomes an empty field. `company` is not stored on the job,
// so the details step fills it from the employer profile.
export const jobToFormValues = (job: BackendJobWithSimulation): Partial<JobPostingFormInput> => ({
    title: job.title ?? "",
    role: job.role ?? "",
    skillLevel: job.skillLevel ?? "",
    skillCategory: job.skillCategory ?? undefined,
    location: job.location ?? "",
    employmentType: job.employmentType ?? "",
    deadline: job.applicationDeadline ? job.applicationDeadline.slice(0, 10) : "",
    isRemoteFriendly: job.isRemoteFriendly,
    salaryFrom: job.salaryRange?.min ?? undefined,
    salaryTo: job.salaryRange?.max ?? undefined,
    companyDescription: job.companyDescription ?? undefined,
    skills: job.requiredSkills,
    description: job.description ?? "",
    businessProblem: job.businessProblem ?? undefined,
    tasks: job.simulation?.tasks ?? [],
});
