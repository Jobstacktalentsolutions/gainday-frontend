import type { CreditPurchaseStatus } from "./payments";

export interface PurchaseRecord {
    id: string;
    packName: string;
    creditsAdded: number;
    /** Pence actually charged. 0 for the launch-offer pack. */
    pricePence: number;
    /** Pence at list price, so a £0 row can render as "£49 → £0". */
    listPricePence: number;
    createdAt: string;
    status: CreditPurchaseStatus;
    /** Stripe-hosted receipt. Only present for SUCCEEDED, paid purchases. */
    receiptUrl?: string | null;
}

export interface UnlockRecord {
    id: string;
    submissionId: string;
    jobId: string;
    candidateName: string;
    jobTitle: string;
    unlockedAt: string;
    creditsUsed: number;
}

export interface FreePackClaimResult {
    balance: number;
}