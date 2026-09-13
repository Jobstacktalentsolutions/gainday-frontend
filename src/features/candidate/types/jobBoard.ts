export type JobStatus = | "DRAFT" | "GENERATING" | "ACTIVE" | "UNDER_REVIEW" | "SHORTLIST_READY" | "CLOSED" | "GENERATION_FAILED";

export interface JobSalaryRange {
    min: number;
    max: number;
    currency: string;
}

export interface JobBoardEmployer {
    companyName: string;
}

export interface JobBoardListing {
    id: string;
    title: string;
    description: string;
    requiredSkills: string[];
    roleCategory: string;
    location: string;
    employmentType: string;
    salaryRange: JobSalaryRange;
    applicationDeadline: string;
    businessProblem: string;
    status: JobStatus;
    employerId: string;
    employer: JobBoardEmployer;
    createdAt: string;
    updatedAt: string;
}

export interface FilterOption {
    value: string;
    label: string;
}

export interface SalaryBucket extends FilterOption {
    min: number;
    max: number;
}

//for salary dropdown
export const SALARY_BUCKETS: SalaryBucket[] = [
    { value: "under-50k", label: "Under 50,000", min: 0, max: 50_000 },
    { value: "50k-100k", label: "50,000 – 100,000", min: 50_000, max: 100_000 },
    { value: "100k-plus", label: "100,000+", min: 100_000, max: Infinity },
];

export interface JobBoardFilters {
    search: string;
    roleCategory: string | null;
    location: string | null;
    employmentType: string | null;
    salaryBucket: string | null;
}

export const DEFAULT_JOB_BOARD_FILTERS: JobBoardFilters = {
    search: "",
    roleCategory: null,
    location: null,
    employmentType: null,
    salaryBucket: null,
};

