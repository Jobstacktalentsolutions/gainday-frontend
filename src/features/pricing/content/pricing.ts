export interface PricingPack {
    id: string;
    name: string;
    credits: number;
    pricePence: number;
    popular?: boolean;
}

// Static copy for now (live /payments/packs may require auth, and this page is public).
// Keep in sync with the backend packs until this is wired to the API.
export const PRICING_PACKS: PricingPack[] = [
    { id: "starter", name: "Starter", credits: 1, pricePence: 4900 },
    { id: "growth", name: "Growth", credits: 5, pricePence: 14900, popular: true },
    { id: "scale", name: "Scale", credits: 12, pricePence: 29900 },
];

export const PRICING_CHIPS = [
    "1 credit = 1 unlock",
    "Packs are one-off, no subscription",
    "Credits never expire",
    "Unlocking the same candidate twice costs nothing",
    "Credits work across all roles",
];

export const FREE_FEATURES = [
    "Your account",
    "Posting roles",
    "The generated simulation",
    "Scored work",
    "Rubric evidence",
    "Capability Passport summary",
    "Right-to-work status",
];

export const PAID_LOCKED = ["Name", "Email", "Phone", "CV"];