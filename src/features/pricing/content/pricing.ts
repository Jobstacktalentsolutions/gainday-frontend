export interface PricingPack {
    id: string;
    name: string;
    credits: number;
    pricePence: number;
    popular?: boolean;
}

export const PRICING_CHIPS = [
    "1 credit unlocks 1 candidate",
    "Credits never expire",
    "Use credits across your roles",
];

export const FREE_FEATURES = [
    "Post Job Adverts",
    "Review the generated work simulation",
    "Review scored candidate work",
    "See evidence against the scoring criteria",
];

export const PAID_LOCKED = ["Candidate name", "Email address", "Phone number"];