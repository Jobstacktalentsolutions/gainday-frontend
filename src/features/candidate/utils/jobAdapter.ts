import type { JobBoardListing, JobSalaryRange, JobStatus } from "../types/jobBoard";

// job.role (FINANCE/SALES) is the only category source the backend currently supports —
// set at job creation and always available. Mirrors the same mapping the employer side
// uses in features/employer/hooks/useJobPreview.ts.
type BackendJobRole = "FINANCE" | "SALES";
const ROLE_CATEGORY_LABELS: Record<BackendJobRole, string> = { FINANCE: "Finance", SALES: "Sales" };

export interface BackendJob {
    id: string;
    title: string | null;
    description: string | null;
    requiredSkills: string[];
    role: BackendJobRole | null;
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
        roleCategory: job.role ? ROLE_CATEGORY_LABELS[job.role] : "General",
        location: job.location ?? "Not set",
        employmentType: job.employmentType ?? "Not set",
        salaryRange: job.salaryRange ?? { min: null, max: null, currency: "USD" },
        applicationDeadline: job.applicationDeadline,
        businessProblem: job.businessProblem ?? "",
        status: job.status,
        employerId: job.employerId,
        employer: { companyName: job.employer?.companyName ?? "Undisclosed company" },
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
    };
}
