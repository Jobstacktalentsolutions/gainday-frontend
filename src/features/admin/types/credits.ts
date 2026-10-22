export type CreditLedgerType = "SIGNUP_BONUS" | "PURCHASE" | "UNLOCK";

export interface SignupBonusSettings {
  enabled: boolean;
  creditAmount: number;
  updatedAt: string | null;
  updatedByName: string | null;
}

export interface CreditTotals {
  signupBonusRecipients: number;
  signupBonusCredits: number;
  purchasedCredits: number;
  creditsSpent: number;
  outstandingCredits: number;
}

export interface CreditOverview {
  signupBonus: SignupBonusSettings;
  totals: CreditTotals;
  revenue: CreditRevenueSummary;
}

export interface CreditLedgerEntry {
  id: string;
  type: CreditLedgerType;
  /** Positive for grants and purchases, negative for unlocks. */
  amount: number;
  employerId: string;
  employerName: string | null;
  submissionId: string | null;
  createdAt: string;
}

export interface SignupBonusUpdatePayload {
  enabled: boolean;
  creditAmount: number;
}

export interface CreditRevenueSummary {
  currency: "GBP";
  /** USD per 1 GBP, or null when no exchange rate is configured on the backend. */
  usdRate: number | null;
  allTimeGbpPence: number;
  allTimeUsd: number | null;
}

export interface CreditRevenueSeriesPoint {
  label: string;
  pence: number;
  usd: number | null;
  purchases: number;
}

export interface CreditRevenue {
  timeframe: "day" | "week" | "month" | "year" | "all";
  currency: "GBP";
  usdRate: number | null;
  totals: {
    periodPence: number;
    periodUsd: number | null;
    periodPurchases: number;
    allTimePence: number;
    allTimeUsd: number | null;
  };
  series: CreditRevenueSeriesPoint[];
}
