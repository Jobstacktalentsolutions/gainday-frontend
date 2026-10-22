import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  CreditLedgerEntry,
  CreditLedgerType,
  CreditOverview,
  SignupBonusSettings,
  SignupBonusUpdatePayload,
} from "../types/credits";
import type { PaginatedResponse } from "../types/pagination";

const CREDITS_KEY = ["admin", "credits"] as const;

export function useCreditOverview() {
  return useQuery({
    queryKey: [...CREDITS_KEY, "overview"],
    queryFn: async () => {
      const { data } = await apiClient.get<CreditOverview>("/admin/credits/overview");
      return data;
    },
  });
}

export function useCreditLedger(type?: CreditLedgerType) {
  return useInfiniteQuery({
    queryKey: [...CREDITS_KEY, "ledger", type],
    queryFn: async ({ pageParam }) => {
      const { data } = await apiClient.get<PaginatedResponse<CreditLedgerEntry>>("/admin/credits/ledger", {
        params: { page: pageParam, limit: 10, type },
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined),
  });
}

export function useUpdateSignupBonus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SignupBonusUpdatePayload) => {
      const { data } = await apiClient.put<SignupBonusSettings>("/admin/settings/signup-bonus", payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CREDITS_KEY }),
  });
}
