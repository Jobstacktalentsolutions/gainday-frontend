import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
    GenerationReviewItem,
    GenerationReviewStatus,
    QuestionBankTaskContent,
} from "../types/generationReview";

const QUERY_KEY = (status?: GenerationReviewStatus) =>
    ["admin", "generation-reviews", status ?? "all"] as const;

const fetchGenerationReviews = async (
    status?: GenerationReviewStatus,
): Promise<GenerationReviewItem[]> => {
    const { data } = await apiClient.get<GenerationReviewItem[]>(
        "/admin/generation-reviews",
        { params: status ? { status } : undefined },
    );
    return data;
};

export const useGenerationReviews = (status?: GenerationReviewStatus) => {
    return useQuery({
        queryKey: QUERY_KEY(status),
        queryFn: () => fetchGenerationReviews(status),
    });
};

export const useApproveGenerationReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            taskContent,
        }: {
            id: string;
            taskContent: QuestionBankTaskContent;
        }) => {
            const { data } = await apiClient.put(
                `/admin/generation-reviews/${id}/approve`,
                { taskContent },
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "generation-reviews"] });
        },
    });
};

export const useRejectGenerationReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await apiClient.put(
                `/admin/generation-reviews/${id}/reject`,
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "generation-reviews"] });
        },
    });
};
