import type { JobRole } from "../schemas/jobPosting";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

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
    // The AI-enhanced, markdown-formatted rewrite of the pasted job description.
    formattedDescription?: string;
    // The specific problem this hire should help solve, only if explicitly stated in the raw
    // text — see gainday-backend's extraction node, which relies on the same "never invent" rule.
    businessProblem?: string;
}

// Backend response fields are nullable (Gemini structured-output convention — see
// gainday-backend's parsed-job-description.schema.ts) rather than undefined/absent.
type ParsedJobDescriptionResponse = {
    [K in keyof ParsedJobDetails]: ParsedJobDetails[K] | null;
};

const nullsToUndefined = (parsed: ParsedJobDescriptionResponse): ParsedJobDetails => {
    const result: ParsedJobDetails = {};
    (Object.keys(parsed) as Array<keyof ParsedJobDetails>).forEach((key) => {
        const value = parsed[key];
        if (value !== null && value !== undefined) {
            (result[key] as unknown) = value;
        }
    });
    return result;
};

const parseJobDescription = async (rawText: string): Promise<ParsedJobDetails> => {
    const { data } = await apiClient.post<ParsedJobDescriptionResponse>(
        "/jobs/parse-description",
        { rawText },
    );
    return nullsToUndefined(data);
};

export const useParseJobDescription = () => {
    return useMutation({
        mutationFn: (rawText: string) => parseJobDescription(rawText),
    })
}
