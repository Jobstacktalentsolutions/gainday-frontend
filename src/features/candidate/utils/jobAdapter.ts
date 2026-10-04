import type { JobBoardListing, JobSalaryRange, JobStatus } from "../types/jobBoard";

export interface BackendJob {
    id: string;
    title: string | null;
    description: string | null;
    requiredSkills: string[];
    // Free text, not an enum — a built-in preset (Finance, Sales) or an employer-typed custom
    // role. The AI generation pipeline supports any role (a generic fallback module handles
    // ones with no purpose-built module — see backend's RoleRegistry.resolve), so the job board
    // shows it as-is rather than mapping it through a fixed label set.
    role: string | null;
    location: string | null;
    employmentType: string | null;
    salaryRange: JobSalaryRange | null;
    applicationDeadline: string | null;
    businessProblem: string | null;
    status: JobStatus;
    employerId: string;
    employer: { companyName: string | null } | null;
    createdAt: string;
    updatedAt: string;
}

export function toJobBoardListing(job: BackendJob): JobBoardListing {
    return {
        id: job.id,
        title: job.title ?? "Untitled role",
        description: job.description ?? "",
        requiredSkills: job.requiredSkills,
        roleCategory: job.role ?? "General",
        location: job.location ?? "Not set",
        employmentType: job.employmentType ?? "Not set",
        salaryRange: job.salaryRange ?? { min: null, max: null, currency: "GBP" },
        applicationDeadline: job.applicationDeadline,
        businessProblem: job.businessProblem ?? "",
        status: job.status,
        employerId: job.employerId,
        employer: { companyName: job.employer?.companyName ?? "Undisclosed company" },
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
    };
}
