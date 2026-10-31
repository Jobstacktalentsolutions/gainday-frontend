import type { LegalBlock, LegalSection } from "./types";

// Single source of truth. Change the contact address here and every page updates.
export const LEGAL_COMPANY = {
    name: "Gainday Ltd",
    tradingAs: "Gainday",
    companyNumber: "17235525",
    registered: "Coventry, UK",
    ico: "C2000651",
    email: "contact@gainday.org",
    lastUpdated: "8 August 2026",
} as const;

export const WHAT_GAINDAY_IS: string[] = [
    "Gainday is a technology platform that enables employers to assess candidates through role-specific work simulation assessments. It is not a recruitment agency, an employment agency or an employment business.",
    "Gainday does not employ candidates, does not supply workers, and does not enter into employment contracts with candidates.",
    "Gainday does not guarantee an interview, progression or a job offer to any candidate.",
    "Work simulation assessment scoring is AI-assisted decision support that helps employers review submitted work. It never makes the hiring decision.",
    "Employers remain responsible for reviewing candidate evidence and making their own recruitment and hiring decisions.",
    "No solely automated decision with legal or similarly significant effect is made about a candidate. A human always reviews before any hiring outcome.",
];

// ── Builders (keep the content files readable) ────────────────────────────────
export const p = (text: string): LegalBlock => ({ type: "p", text });
export const ul = (...items: string[]): LegalBlock => ({ type: "ul", items });
export const kv = (...rows: Array<[string, string]>): LegalBlock => ({ type: "kv", rows });

export const section = (label: string, title: string, ...blocks: LegalBlock[]): LegalSection => ({
    id: label.toLowerCase(),
    label,
    title,
    blocks,
});

export const companyDetails = (): LegalBlock =>
    kv(
        ["Company", LEGAL_COMPANY.name],
        ["Company number", LEGAL_COMPANY.companyNumber],
        ["Registered address", LEGAL_COMPANY.registered],
        ["ICO registration number", LEGAL_COMPANY.ico],
        ["Privacy contact", LEGAL_COMPANY.email],
    );