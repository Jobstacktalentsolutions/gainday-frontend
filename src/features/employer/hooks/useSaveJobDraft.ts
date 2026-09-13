import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { JobPostingFormInput } from "../schemas/jobPosting";

export interface SaveJobDraftPayload extends Partial<JobPostingFormInput> {
    id?: string;
}

interface SavedJob {
    id: string;
    status: string;
}

const cleanInt = (val: unknown): number | undefined => {
    if (val === undefined || val === null || val === "") return undefined;
    if (typeof val === "number") return isNaN(val) ? undefined : Math.round(val);
    if (typeof val === "string") {
        const cleaned = val.replace(/,/g, "").trim();
        if (!cleaned) return undefined;
        const num = parseInt(cleaned, 10);
        return isNaN(num) ? undefined : num;
    }
    return undefined;
};

const buildBody = (values: Partial<JobPostingFormInput>) => ({
    title: values.title,
    role: values.role,
    skillLevel: values.skillLevel,
    location: values.location,
    employmentType: values.employmentType,
    applicationDeadline: values.deadline || undefined,
    isRemoteFriendly: values.isRemoteFriendly,
    salaryFrom: cleanInt(values.salaryFrom),
    salaryTo: cleanInt(values.salaryTo),
    companyDescription: values.companyDescription,
    skills: values.skills,
    description: values.description,
    businessProblem: values.businessProblem,
});

export const useSaveJobDraft = () => {
    return useMutation({
        mutationFn: async ({ id, ...values }: SaveJobDraftPayload) => {
            const body = buildBody(values);
            const res = id
                ? await apiClient.patch<SavedJob>(`/jobs/draft/${id}`, body)
                : await apiClient.post<SavedJob>("/jobs/draft", body);
            return res.data;
        },
    });
};

export const useSaveJobDetails = () => {
    return useMutation({
        mutationFn: async ({ id, ...values }: SaveJobDraftPayload) => {
            const body = buildBody(values);
            const res = id
                ? await apiClient.patch<SavedJob>(`/jobs/${id}`, body)
                : await apiClient.post<SavedJob>("/jobs", body);
            return res.data;
        },
    });
};
