import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { CreateExperienceReviewPayload, MyExperienceReview } from "../types";

const MY_REVIEW_KEY = ["reviews", "me"] as const;

export function useMyExperienceReview(enabled: boolean) {
  return useQuery({
    queryKey: MY_REVIEW_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<MyExperienceReview>("/reviews/me");
      return data;
    },
    enabled,
  });
}

export function useSubmitExperienceReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateExperienceReviewPayload) => {
      const { data } = await apiClient.post("/reviews", payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_REVIEW_KEY }),
  });
}
