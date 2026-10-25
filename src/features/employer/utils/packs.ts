import type { CreditPack } from "../types/payments";

export const pluralise = (count: number, singular: string) =>
    `${count} ${singular}${count === 1 ? "" : "s"}`;

/** The launch offer applies to the cheapest pack (Starter), so no pack name is hardcoded. */
export const getLaunchOfferPack = (packs: CreditPack[]): CreditPack | null =>
    packs.length === 0
        ? null
        : packs.reduce((cheapest, pack) => (pack.pricePence < cheapest.pricePence ? pack : cheapest));

/** Matches a backend pack id or a pack name ("starter"), case-insensitively. */
export const findPack = (packs: CreditPack[] | undefined, key: string | undefined) => {
    if (!packs || !key) return undefined;
    const needle = key.toLowerCase();
    return packs.find((pack) => pack.id.toLowerCase() === needle || pack.name.toLowerCase() === needle);
};