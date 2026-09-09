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