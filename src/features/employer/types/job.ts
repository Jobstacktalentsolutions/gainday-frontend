import type { SimulationTask } from "@/features/simulation-tasks/types";

export type JobStatus =
    | "DRAFT"
    | "GENERATING"
    | "ACTIVE"
    | "CLOSED"
    | "GENERATION_FAILED";
export type JobStatusFilter = "all" | JobStatus;

export interface Job {
    id: string;
    title: string;
    status: JobStatus;
    location: string;
    employmentType: string;
    submissionsCount: number;
    postedAt: string | null;
    shareUrl: string;
}

export interface BackendSalaryRange {
    min: number | null;
    max: number | null;
    currency: string;
}

// Mirrors GET /jobs/:id/with-simulation (JobsService.findByIdWithSimulation): the jobs row with its
// simulation relation. Nullable columns stay nullable here; each consumer decides how to show them.
export interface BackendJobWithSimulation {
    id: string;
    title: string | null;
    description: string | null;
    role: string | null;
    skillLevel: string | null;
    skillCategory: string | null;
    companyDescription: string | null;
    location: string | null;
    employmentType: string | null;
    isRemoteFriendly: boolean;
    requiredSkills: string[];
    salaryRange: BackendSalaryRange | null;
    applicationDeadline: string | null;
    businessProblem: string | null;
    status: JobStatus;
    updatedAt: string;
    simulation: {
        id: string;
        tasks: SimulationTask[];
        timeLimitMinutes: number;
    } | null;
}
