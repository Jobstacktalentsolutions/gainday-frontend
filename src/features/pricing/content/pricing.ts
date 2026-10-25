export interface PricingPack {
    id: string;
    name: string;
    credits: number;
    pricePence: number;
    popular?: boolean;
}

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