// Mirrors gainday-backend/src/db/schema/job-seeker-profiles.schema.ts (Gender, Pronouns).
export type Gender = "MALE" | "FEMALE" | "NON_BINARY";
export type Pronouns = "HE_HIM" | "SHE_HER" | "THEY_THEM";

export const GENDER_LABELS: Record<Gender, string> = {
    MALE: "Male",
    FEMALE: "Female",
    NON_BINARY: "Non-binary",
};

export const PRONOUN_LABELS: Record<Pronouns, string> = {
    HE_HIM: "He/Him",
    SHE_HER: "She/Her",
    THEY_THEM: "They/Them",
};

export const GENDER_OPTIONS = (Object.keys(GENDER_LABELS) as Gender[]).map((value) => ({
    value,
    label: GENDER_LABELS[value],
}));

export const PRONOUN_OPTIONS = (Object.keys(PRONOUN_LABELS) as Pronouns[]).map((value) => ({
    value,
    label: PRONOUN_LABELS[value],
}));

/** The candidate-supplied details shown on a Capability Passport. */
export interface CandidateProfileInfo {
    gender: Gender | null;
    pronouns: Pronouns | null;
    /** The role the candidate is looking for. Drives job recommendations. */
    title: string | null;
    /** Null for employers until the candidate is unlocked. */
    brief: string | null;
}
