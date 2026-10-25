import type { PurchaseRecord, UnlockRecord } from "../types/billing";

// Flip to false once GET /payments/purchases and GET /payments/unlocks exist (see the hooks).
export const USE_MOCK_BILLING = true;

export const MOCK_PURCHASES: PurchaseRecord[] = [
    { id: "pur_1", packName: "Starter", creditsAdded: 1, pricePence: 0, listPricePence: 4900, createdAt: "2026-10-23T09:12:00Z", status: "SUCCEEDED" },
    { id: "pur_2", packName: "Scale", creditsAdded: 12, pricePence: 29900, listPricePence: 29900, createdAt: "2026-10-23T10:40:00Z", status: "SUCCEEDED", receiptUrl: "https://example.com/receipts/pur_2" },
    { id: "pur_3", packName: "Starter", creditsAdded: 1, pricePence: 4900, listPricePence: 4900, createdAt: "2026-10-24T08:05:00Z", status: "PENDING" },
    { id: "pur_4", packName: "Growth", creditsAdded: 5, pricePence: 14900, listPricePence: 14900, createdAt: "2026-09-15T14:20:00Z", status: "SUCCEEDED", receiptUrl: "https://example.com/receipts/pur_4" },
    { id: "pur_5", packName: "Growth", creditsAdded: 5, pricePence: 14900, listPricePence: 14900, createdAt: "2026-08-30T11:00:00Z", status: "FAILED" },
];

export const MOCK_UNLOCKS: UnlockRecord[] = [
    { id: "unl_1", submissionId: "sub_1", jobId: "job_1", candidateName: "Amara Okafor", jobTitle: "Product Designer", unlockedAt: "2026-10-23T09:30:00Z", creditsUsed: 1 },
    { id: "unl_2", submissionId: "sub_2", jobId: "job_2", candidateName: "Liam Chen", jobTitle: "Finance Manager", unlockedAt: "2026-10-12T16:10:00Z", creditsUsed: 1 },
    { id: "unl_3", submissionId: "sub_3", jobId: "job_3", candidateName: "Sofia Martinez", jobTitle: "Accountant", unlockedAt: "2026-09-02T10:45:00Z", creditsUsed: 1 },
    { id: "unl_4", submissionId: "sub_4", jobId: "job_1", candidateName: "Tunde Bello", jobTitle: "Product Designer", unlockedAt: "2026-08-18T13:00:00Z", creditsUsed: 1 },
];