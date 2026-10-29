import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { PaginatedResponse } from "../types/pagination";
import type { ExperienceReviewItem, ExperienceReviewSummary } from "../types/reviews";
import type { Timeframe } from "./useDashboardStats";

const REVIEWS_KEY = ["admin", "reviews"] as const;

export function useExperienceReviewSummary(timeframe: Timeframe) {
  return useQuery({
    queryKey: [...REVIEWS_KEY, "summary", timeframe],
    queryFn: async () => {
      const { data } = await apiClient.get<ExperienceReviewSummary>("/admin/reviews/summary", {
        params: { timeframe },
      });
      return data;
    },
    staleTime: 30_000,
  });
}

export function useExperienceReviewList() {
  return useInfiniteQuery({
    queryKey: [...REVIEWS_KEY, "list"],
    queryFn: async ({ pageParam }) => {
      const { data } = await apiClient.get<PaginatedResponse<ExperienceReviewItem>>("/admin/reviews", {
        params: { page: pageParam, limit: 10 },
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined),
  });
}
