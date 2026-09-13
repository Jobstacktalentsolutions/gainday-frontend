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

// TODO: swap this mock for the real POST /jobs/parse-description call once the
// backend endpoint ships. Expected contract: raw JD text in, ParsedJobDetails out,
// with role/skillLevel/employmentType already normalized to match the frontend enums
// (ROLES/SKILL_LEVELS/EMPLOYMENT_TYPES) exactly, so no fuzzy-matching happens here.

const mockParseJobDescription = (rawText: string) => {
    console.log("Raw text : ", rawText);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                title: "Business Manager",
                role: "FINANCE",
                skillLevel: "Senior level",
                skillCategory: "Credit Risk",
                location: "London, UK",
                employmentType: "Full-time",
                isRemoteFriendly: false,
                salaryFrom: 60000,
                salaryTo: 80000,
                skills: ["Business management", "PowerPoint", "Data analysis", "Stakeholder comms"],
            })
        }, 1600);
    });
}

export const useParseJobDescription = () => {
    return useMutation({
        mutationFn : (rawText : string) => mockParseJobDescription(rawText),
    })
}