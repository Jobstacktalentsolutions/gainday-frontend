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

const buildBody = (values: Partial<JobPostingFormInput>) => ({
    title: values.title,
    role: values.role,
    skillLevel: values.skillLevel,
    skillCategory: values.skillCategory,
    location: values.location,
    employmentType: values.employmentType,
    applicationDeadline: values.deadline || undefined,
    isRemoteFriendly: values.isRemoteFriendly,
    salaryFrom: values.salaryFrom === undefined ? undefined : Number(values.salaryFrom),
    salaryTo: values.salaryTo === undefined ? undefined : Number(values.salaryTo),
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
