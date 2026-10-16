// Mirrors gainday-backend/src/modules/credits/credit-packs.ts and the /payments/* responses
// (see gainday-backend/docs/credits-payments-frontend-integration.md). Verified against the
// backend source, not guessed.

export interface CreditPack {
    id: string;
    name: string;
    pricePence: number;
    credits: number;
    label: string | null;
}

export interface CreditBalance {
    balance: number;
}

export interface UnlockResult {
    unlockedSubmissionIds: string[];
    creditsUsed: number;
    balance: number;
}

/** Thrown by the backend as HTTP 402 when the balance can't cover the unlock. */
export interface PaymentRequiredBody {
    statusCode: number;
    message: string;
    balance: number;
    needed: number;
    shortfall: number;
    recommendedPackId: string;
}

export interface CreatePurchaseResult {
    purchaseId: string;
    clientSecret: string;
}

export type CreditPurchaseStatus = "PENDING" | "SUCCEEDED" | "FAILED";

export interface CreditPurchase {
    id: string;
    status: CreditPurchaseStatus;
}
