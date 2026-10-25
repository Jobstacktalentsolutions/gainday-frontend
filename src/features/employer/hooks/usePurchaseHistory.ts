import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { MOCK_PURCHASES, USE_MOCK_BILLING } from "../mocks/billing";
import type { PurchaseRecord } from "../types/billing";

export const purchaseHistoryQueryKey = ["employer", "purchase-history"] as const;

const fetchPurchases = async (): Promise<PurchaseRecord[]> => {
    let rows: PurchaseRecord[];
    if (USE_MOCK_BILLING) {
        await new Promise((resolve) => setTimeout(resolve, 400)); // lets the loading state be seen
        rows = MOCK_PURCHASES;
    } else {
        // Contract: returns the employer's full purchase history (client-side filtering at MVP).
        const { data } = await apiClient.get<PurchaseRecord[]>("/payments/purchases");
        rows = data;
    }
    return [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const usePurchaseHistory = () =>
    useQuery({ queryKey: purchaseHistoryQueryKey, queryFn: fetchPurchases });