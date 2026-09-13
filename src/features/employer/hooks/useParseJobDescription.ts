import type { JobRole } from "../schemas/jobPosting";
import { useMutation } from "@tanstack/react-query";

export interface ParsedJobDetails {
    title?: string;
    role?: JobRole;
    skillLevel?: string;
    skillCategory?: string;
    location?: string;
    employmentType?: string;
    deadline?: string;
    isRemoteFriendly?: boolean;
    salaryFrom?: number;
    salaryTo?: number;
    companyDescription?: string;
    skills?: string[];
}