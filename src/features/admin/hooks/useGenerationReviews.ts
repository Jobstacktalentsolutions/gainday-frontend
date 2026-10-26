import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  GenerationReviewItem,
  GenerationReviewJobGroup,
  GenerationReviewStatus,
  QuestionBankTaskContent,
} from "../types/generationReview";
import type { PaginatedResponse } from "../types/pagination";

export interface GenerationReviewsQueryParams {
  status?: GenerationReviewStatus;
  limit?: number;
}

const fetchGenerationReviews = async (
  params: GenerationReviewsQueryParams & { page: number }
): Promise<PaginatedResponse<GenerationReviewItem>> => {
  const { data } = await apiClient.get<PaginatedResponse<GenerationReviewItem>>(
    "/admin/generation-reviews",
    {
      params: {
        status: params.status || undefined,
        page: params.page,
        limit: params.limit || 10,
      },
    }
  );
  return data;
};

// Individual review items, one row per slot.
export const useGenerationReviews = (status?: GenerationReviewStatus, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["admin", "generation-reviews", status ?? "all", limit],
    queryFn: ({ pageParam = 1 }) => fetchGenerationReviews({ status, limit, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
  });
};

const fetchGenerationReviewJobs = async (
  status: GenerationReviewStatus | undefined,
  page: number,
  limit: number
): Promise<PaginatedResponse<GenerationReviewJobGroup>> => {
  const { data } = await apiClient.get<PaginatedResponse<GenerationReviewJobGroup>>(
    "/admin/generation-reviews/by-job",
    { params: { status, page, limit } }
  );
  return data;
};

// Review items grouped by job. The key starts with "generation-reviews" so the approve and reject
// mutations below refresh it.
export const useGenerationReviewJobs = (status?: GenerationReviewStatus, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["admin", "generation-reviews", "by-job", status ?? "all", limit],
    queryFn: ({ pageParam }) => fetchGenerationReviewJobs(status, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
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
        { taskContent }
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
        `/admin/generation-reviews/${id}/reject`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "generation-reviews"] });
    },
  });
};
