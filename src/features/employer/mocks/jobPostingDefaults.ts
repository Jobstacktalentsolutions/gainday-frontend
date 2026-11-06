import type { JobPostingFormValues } from "../schemas/jobPosting";

export const JOB_POSTING_DEFAULT_VALUES: Partial<JobPostingFormValues> = {
    title: "",
    role: "",
    company: "",
    location: "",
    employmentType: "",
    skillLevel: "",
    skillCategory: "",
    description: "",
    businessProblem: "",
    deadline: "",
    isRemoteFriendly: false,
    skills: [],
    tasks: [],
};
