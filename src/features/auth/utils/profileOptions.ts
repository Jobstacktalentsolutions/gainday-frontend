// Mirrors gainday-backend/src/db/schema/job-seeker-profiles.schema.ts (Gender).
export type Gender = "MALE" | "FEMALE" | "NON_BINARY";

export const GENDER_LABELS: Record<Gender, string> = {
    MALE: "Male",
    FEMALE: "Female",
    NON_BINARY: "Non-binary",
};

export const GENDER_OPTIONS = (Object.keys(GENDER_LABELS) as Gender[]).map((value) => ({
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
