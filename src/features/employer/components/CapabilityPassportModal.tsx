import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ActionButton } from "@/components/ui/ActionButton";
import { Check, LockOpen, Mail, Phone, User } from "lucide-react";
import CapabilityPassportView from "@/features/capability-passport/components/CapabilityPassportView";
import CapabilityPassportSkeleton from "@/features/capability-passport/components/CapabilityPassportSkeleton";
import CandidateProfileCard from "@/features/capability-passport/components/CandidateProfileCard";
import type { CapabilityPassportSummary } from "@/features/capability-passport/types/passport";
import type { CandidateProfileInfo } from "@/features/auth/utils/profileOptions";
import type { SubmissionContact } from "../types/submission";

interface CapabilityPassportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    candidateName: string;
    displayId?: string;
    candidateProfile: CandidateProfileInfo | null;
    passport: CapabilityPassportSummary | null | undefined;
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
    /** The unlock button is hidden once the contact has been unlocked. */
    isUnlocked: boolean;
    isSelected?: boolean;
    contact?: SubmissionContact | null;
    onUnlockContact: () => void;
}

// The full passport is visible before unlock — the lock only gates the candidate's contact details
// (and their brief; gender and pronouns show either way).
const CapabilityPassportModal = ({
    open,
    onOpenChange,
    candidateName,
    displayId,
    candidateProfile,
    passport,
    isLoading,
    isError,
    onRetry,
    isUnlocked,
    isSelected = false,
    contact,
    onUnlockContact,
}: CapabilityPassportModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                overlayClassName="bg-[rgba(178,201,255,0.1)] supports-backdrop-filter:backdrop-blur-[15px]"
                className="max-h-[calc(100vh-2rem)] gap-8 overflow-y-auto rounded-2xl bg-neutral-50 p-6 shadow-[0px_1px_20px_0px_rgba(123,123,123,0.05),0px_4px_10px_0px_rgba(123,123,123,0.05)] ring-0 sm:max-w-269 lg:p-12 scrollbar-thin [scrollbar-color:var(--color-neutral-300)_var(--color-neutral-100)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400"
            >
                <DialogTitle className="sr-only">{candidateName}'s Capability Passport</DialogTitle>

                {/* Candidate Contact & Identity Header (Shown when unlocked) */}
                {isUnlocked && contact && (
                    <section className="flex flex-col gap-4 rounded-xl border border-primary-100 bg-white p-6 shadow-xs">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                                    <User className="size-5" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-bold leading-tight text-neutral-900">{candidateName}</h3>
                                    {displayId && <p className="text-xs text-neutral-500">{displayId}</p>}
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                {isSelected && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-success-200 bg-success-100 px-3 py-1 text-xs font-semibold text-success-800">
                                        <Check className="size-3.5 text-success-700" />
                                        Selected Candidate
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                                    <LockOpen className="size-3.5 text-primary-600" />
                                    Contact Unlocked
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50/80 p-3.5">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white text-primary-600 shadow-2xs">
                                    <Mail className="size-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs uppercase tracking-wider text-neutral-400">Email Address</p>
                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="block truncate text-sm font-semibold text-neutral-900 hover:text-primary-600 hover:underline"
                                    >
                                        {contact.email}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50/80 p-3.5">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white text-primary-600 shadow-2xs">
                                    <Phone className="size-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs uppercase tracking-wider text-neutral-400">Phone Number</p>
                                    {contact.phone ? (
                                        <a
                                            href={`tel:${contact.phone}`}
                                            className="block truncate text-sm font-semibold text-neutral-900 hover:text-primary-600 hover:underline"
                                        >
                                            {contact.phone}
                                        </a>
                                    ) : (
                                        <p className="text-sm font-medium text-neutral-400">Not provided</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {candidateProfile && <CandidateProfileCard profile={candidateProfile} />}

                {isLoading && <CapabilityPassportSkeleton variant="employer" />}

                {!isLoading && isError && (
                    <div className="w-full rounded-3xl border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
                        Something went wrong loading this Capability Passport.{" "}
                        <button type="button" onClick={onRetry} className="underline">
                            Try again
                        </button>
                    </div>
                )}

                {!isLoading && !isError && passport && <CapabilityPassportView passport={passport} variant="employer" />}

                {!isUnlocked && (
                    <ActionButton size="lg" className="rounded-xl" onClick={onUnlockContact}>
                        Unlock Contact
                    </ActionButton>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CapabilityPassportModal;