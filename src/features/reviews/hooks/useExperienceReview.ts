import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { CreateExperienceReviewPayload } from "../types";

export function useSubmitExperienceReview() {
  return useMutation({
    mutationFn: async (payload: CreateExperienceReviewPayload) => {
      const { data } = await apiClient.post("/reviews", payload);
      return data;
    },
  });
}
