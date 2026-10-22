import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { Timeframe } from "./useDashboardStats";
import type { CreditRevenue } from "../types/credits";

export function useCreditRevenue(timeframe: Timeframe) {
  return useQuery({
    queryKey: ["admin", "credits", "revenue", timeframe],
    queryFn: async () => {
      const { data } = await apiClient.get<CreditRevenue>("/admin/credits/revenue", {
        params: { timeframe },
      });
      return data;
    },
    staleTime: 30_000,
  });
}
