import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { PurchaseRecord } from "../types/billing";

export const purchaseHistoryQueryKey = ["employer", "purchase-history"] as const;

export const usePurchaseHistory = () =>
    useQuery({
        queryKey: purchaseHistoryQueryKey,
        queryFn: async () => (await apiClient.get<PurchaseRecord[]>("/payments/purchases")).data,
    });
