import { Check, Lock, LockOpen, Mail, Phone } from "lucide-react";
import Skeleton from "@/components/ui/skeleton";
import { ActionButton } from "@/components/ui/ActionButton";
import { formatPhoneForDisplay } from "@/lib/phone";
import type { SubmissionContact } from "../types/submission";

interface ContactCardProps {
    isUnlocked: boolean;
    contact: SubmissionContact | null;
    onUnlock: () => void;
    isSelected?: boolean;
}

const ContactCard = ({ isUnlocked, contact, onUnlock, isSelected = false }: ContactCardProps) => {
    const showContact = isUnlocked && contact !== null;

    return (
        <section className="flex w-full flex-col gap-3 rounded-xl bg-white p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm uppercase text-neutral-700">Contact</h2>
                    {isSelected && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-success-200 bg-success-100 px-2 py-0.5 text-xs font-semibold text-success-800">
                            <Check className="size-3 text-success-700" />
                            Selected
                        </span>
                    )}
                </div>
                {showContact ? (
                    <LockOpen className="size-6 text-neutral-950" aria-hidden="true" />
                ) : (
                    <Lock className="size-6 text-neutral-950" aria-hidden="true" />
                )}
            </div>

            {showContact ? (
                <div className="flex flex-col gap-2 text-base text-neutral-950">
                    <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-2 text-primary-600 hover:underline"
                    >
                        <Mail className="size-4 shrink-0 text-neutral-500" />
                        <span className="truncate">{contact.email}</span>
                    </a>
                    {contact.phone && (
                        <a
                            href={`tel:${contact.phone}`}
                            className="flex items-center gap-2 text-neutral-800 hover:text-primary-600 hover:underline"
                        >
                            <Phone className="size-4 shrink-0 text-neutral-500" />
                            <span className="truncate">{formatPhoneForDisplay(contact.phone)}</span>
                        </a>
                    )}
                </div>
            ) : (
                <>
                    {/* Decorative stand-in only — real contact details are never sent while locked. */}
                    <div aria-hidden="true" className="flex select-none flex-col gap-1 text-base text-neutral-700 blur-sm">
                        <p>candidate.name@example.com</p>
                        <p>+1 555 000 0000</p>
                    </div>
                    <span className="sr-only">Contact details are locked.</span>
                    <ActionButton size="lg" onClick={onUnlock}>
                        Unlock Contact
                    </ActionButton>
                </>
            )}
        </section>
    );
};

export const ContactCardSkeleton = () => {
    return (
        <div className="flex w-full flex-col gap-3 rounded-xl bg-white p-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
    );
};

export default ContactCard;