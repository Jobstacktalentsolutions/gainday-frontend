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

// An empty salary input means "not provided": send null, never 0 (Number("") is 0).
// undefined is left out of the request so the backend keeps the saved value.
const toSalaryBound = (value: unknown): number | null | undefined => {
    if (value === undefined) return undefined;
    if (value === null || value === "") return null;
    const amount = Number(value);
    return Number.isFinite(amount) && amount > 0 ? amount : null;
};

const buildBody = (values: Partial<JobPostingFormInput>) => ({
    title: values.title,
    role: values.role,
    skillLevel: values.skillLevel,
    skillCategory: values.skillCategory,
    location: values.location,
    employmentType: values.employmentType,
    applicationDeadline: values.deadline || undefined,
    isRemoteFriendly: values.isRemoteFriendly,
    salaryFrom: toSalaryBound(values.salaryFrom),
    salaryTo: toSalaryBound(values.salaryTo),
    companyDescription: values.companyDescription,
    skills: values.skills,
    description: values.description,
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
