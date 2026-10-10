import { Lock, LockOpen } from "lucide-react";
import Skeleton from "@/components/ui/skeleton";
import { ActionButton } from "@/components/ui/ActionButton";
import type { SubmissionContact } from "../types/submission";

interface ContactCardProps {
    isUnlocked: boolean;
    contact: SubmissionContact | null;
    onUnlock: () => void;
}

const ContactCard = ({ isUnlocked, contact, onUnlock }: ContactCardProps) => {
    const showContact = isUnlocked && contact !== null;

    return (
        <section className="flex w-full flex-col gap-3 rounded-xl bg-white p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-sm uppercase text-neutral-700">Contact</h2>
                {showContact ? (
                    <LockOpen className="size-6 text-neutral-950" aria-hidden="true" />
                ) : (
                    <Lock className="size-6 text-neutral-950" aria-hidden="true" />
                )}
            </div>

            {showContact ? (
                <div className="flex flex-col gap-1 text-base text-neutral-950">
                    <p>{contact.email}</p>
                    <p>{contact.phone}</p>
                </div>
            ) : (
                <>
                    {/* Decorative stand-in only — real contact details are never sent while locked. */}
                    <div aria-hidden="true" className="flex select-none flex-col gap-1 text-base text-neutral-700 blur-sm">
                        <p>candidate.name@example.com</p>
                        <p>+234 800 000 0000</p>
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