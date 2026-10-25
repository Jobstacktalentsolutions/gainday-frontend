/** £49, £149.50. Whole pounds drop the decimals. */
export const formatPrice = (pence: number): string => {
    const pounds = pence / 100;
    return `£${pounds % 1 === 0 ? pounds.toFixed(0) : pounds.toFixed(2)}`;
};

/** Always two decimals: £29.80. */
export const formatExactPrice = (pence: number): string => `£${(pence / 100).toFixed(2)}`;

/** Per-unlock price in pence, rounded: 29900 / 12 -> 2492. */
export const perUnlockPence = (pricePence: number, credits: number): number =>
    Math.round(pricePence / credits);