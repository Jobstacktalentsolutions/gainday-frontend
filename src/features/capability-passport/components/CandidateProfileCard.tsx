import {
    GENDER_LABELS,
    PRONOUN_LABELS,
    type CandidateProfileInfo,
} from "@/features/auth/utils/profileOptions";

// Each field may be absent (the signed-in user's profile hasn't loaded it) or null (not set).
interface CandidateProfileCardProps {
    profile: Partial<CandidateProfileInfo>;
}

const isPresent = <T,>(value: T | null | undefined): value is T => value !== null && value !== undefined;

// Gender, pronouns and the candidate's own brief, as shown on a Capability Passport — to the
// candidate themselves, and to employers (who get the brief only once unlocked, so it is null
// beforehand and simply not rendered).
const CandidateProfileCard = ({ profile }: CandidateProfileCardProps) => {
    const { gender, pronouns, brief } = profile;
    if (!isPresent(gender) && !isPresent(pronouns) && !isPresent(brief)) {
        return null;
    }

    return (
        <section className="flex w-full flex-col gap-3 rounded-xl bg-white p-6">
            <h2 className="text-sm uppercase text-neutral-700">About the candidate</h2>
            {(isPresent(pronouns) || isPresent(gender)) && (
                <dl className="flex flex-wrap gap-x-10 gap-y-2 text-base text-neutral-950">
                    {isPresent(pronouns) && (
                        <div className="flex flex-col">
                            <dt className="text-sm text-neutral-500">Pronouns</dt>
                            <dd>{PRONOUN_LABELS[pronouns]}</dd>
                        </div>
                    )}
                    {isPresent(gender) && (
                        <div className="flex flex-col">
                            <dt className="text-sm text-neutral-500">Gender</dt>
                            <dd>{GENDER_LABELS[gender]}</dd>
                        </div>
                    )}
                </dl>
            )}
            {isPresent(brief) && <p className="whitespace-pre-line text-base text-neutral-700">{brief}</p>}
        </section>
    );
};

export default CandidateProfileCard;
