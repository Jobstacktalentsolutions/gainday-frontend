import type { LegalAudience, LegalDocument, LegalKind } from "./types";
import { privacyCandidate } from "./privacyCandidate";
import { privacyEmployer } from "./privacyEmployer";
import { termsCandidate } from "./termsCandidate";
import { termsEmployer } from "./termsEmployer";

const REGISTRY: Record<LegalKind, Record<LegalAudience, LegalDocument>> = {
    terms: { candidate: termsCandidate, employer: termsEmployer },
    privacy: { candidate: privacyCandidate, employer: privacyEmployer },
};

export const getLegalDocument = (kind: LegalKind, audience: LegalAudience): LegalDocument =>
    REGISTRY[kind][audience];

export const isLegalAudience = (value: string | undefined): value is LegalAudience =>
    value === "candidate" || value === "employer";