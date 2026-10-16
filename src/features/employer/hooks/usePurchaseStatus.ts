import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { CreditPurchase } from "../types/payments";

// Credits are granted by the Stripe webhook, not by the browser — this polls until the purchase
// leaves PENDING. Interval matches the guidance in
// gainday-backend/docs/credits-payments-frontend-integration.md; the caller is responsible for
// giving up (passing enabled: false) after its own timeout, e.g. ~30s.
export const POLL_INTERVAL_MS = 1000;

const fetchPurchase = async (purchaseId: string): Promise<CreditPurchase> => {
    const { data } = await apiClient.get<CreditPurchase>(`/payments/purchases/${purchaseId}`);
    return data;
};

export const usePurchaseStatus = (purchaseId: string | null, enabled: boolean) => {
    return useQuery({
        queryKey: ["employer", "credit-purchase", purchaseId],
        queryFn: () => fetchPurchase(purchaseId as string),
        enabled: purchaseId !== null && enabled,
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            if (status === "SUCCEEDED" || status === "FAILED") {
                return false;
            }
            return POLL_INTERVAL_MS;
        },
    });
};
