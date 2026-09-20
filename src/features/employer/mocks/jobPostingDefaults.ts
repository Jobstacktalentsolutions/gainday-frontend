import type { JobPostingFormValues } from "../schemas/jobPosting";

export const JOB_POSTING_DEFAULT_VALUES: Partial<JobPostingFormValues> = {
    deadline: "",
    isRemoteFriendly: false,
    skills: [],
    tasks: [],
};
