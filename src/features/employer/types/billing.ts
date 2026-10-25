import type { CreditPurchaseStatus } from "./payments";

// Mirrors the backend's GET /payments/purchases and GET /payments/unlocks (see
// gainday-backend/src/modules/payments/payment-history.mapper.ts).

export interface PurchaseRecord {
    id: string;
    packName: string;
    creditsAdded: number;
    /** Pence charged, which is the pack's list price. */
    pricePence: number;
    createdAt: string;
    status: CreditPurchaseStatus;
}

/** One candidate unlocked, costing one credit. Null fields mean the submission, job or candidate
 *  has since been deleted. */
export interface UnlockRecord {
    id: string;
    submissionId: string | null;
    jobId: string | null;
    jobTitle: string | null;
    candidateName: string | null;
    unlockedAt: string;
}

export interface FreePackClaimResult {
    balance: number;
}
