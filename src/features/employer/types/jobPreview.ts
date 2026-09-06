import type { Job } from "./job";
import type { JobPostingFormValues } from "../schemas/jobPosting";

export interface JobPreviewDetails extends Job {
    description: string;
    category: string;
    salary: string;
    deadline: string; // display string, e.g. "30 Aug 2026"
    isRemoteFriendly: boolean;
    requiredSkills: string[];
    whatThisHireNeedsToSolve: string;
    tasks: JobPostingFormValues["tasks"];
    hiredCandidateId?: string; // only present when status is TERMINATED and a hire was made
}