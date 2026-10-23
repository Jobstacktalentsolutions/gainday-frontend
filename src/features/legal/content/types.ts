export type LegalKind = "terms" | "privacy";
export type LegalAudience = "candidate" | "employer";

export type LegalBlock =
    | { type: "p"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "kv"; rows: Array<[label: string, value: string]> };

export interface LegalSection {
    /** DOM id and URL hash, e.g. "a5". */
    id: string;
    /** The document's own label, e.g. "A5". */
    label: string;
    title: string;
    blocks: LegalBlock[];
}

export interface LegalDocument {
    kind: LegalKind;
    audience: LegalAudience;
    /** Page h1. */
    title: string;
    /** Eyebrow above the sections, e.g. "Candidate Privacy Notice". */
    partTitle: string;
    /** One-line plain-English description shown under the h1 (UI copy, not legal text). */
    summary: string;
    intro?: string;
    sections: LegalSection[];
    closing?: { id: string; title: string; text: string };
}