// Mirrors gainday-backend/src/db/schema/job-seeker-profiles.schema.ts (Gender).
// Keep NON_BINARY readable for existing profiles while offering OTHER for new selections.
export type Gender = "MALE" | "FEMALE" | "NON_BINARY" | "OTHER";

export const GENDER_LABELS: Record<Gender, string> = {
    MALE: "Male",
    FEMALE: "Female",
    NON_BINARY: "Other",
    OTHER: "Other",
};

export const GENDER_OPTIONS = (["MALE", "FEMALE", "OTHER"] as const).map((value) => ({
    value,
    label: GENDER_LABELS[value],
}));

/** The candidate-supplied details shown on a Capability Passport. */
export interface CandidateProfileInfo {
    gender: Gender | null;
    /** The role the candidate is looking for. Drives job recommendations. */
    title: string | null;
    /** Null for employers until the candidate is unlocked. */
    brief: string | null;
}
