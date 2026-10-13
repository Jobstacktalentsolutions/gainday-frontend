import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ActionButton } from "@/components/ui/ActionButton";
import CapabilityPassportView from "@/features/capability-passport/components/CapabilityPassportView";
import CapabilityPassportSkeleton from "@/features/capability-passport/components/CapabilityPassportSkeleton";
import type { CapabilityPassportSummary } from "@/features/capability-passport/types/passport";

interface CapabilityPassportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    candidateName: string;
    passport?: CapabilityPassportSummary;
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
    /** The unlock button is hidden once the contact has been unlocked. */
    isUnlocked: boolean;
    onUnlockContact: () => void;
}

// The full passport is visible before unlock — the lock only gates the candidate's contact details.
const CapabilityPassportModal = ({
    open,
    onOpenChange,
    candidateName,
    passport,
    isLoading,
    isError,
    onRetry,
    isUnlocked,
    onUnlockContact,
}: CapabilityPassportModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                overlayClassName="bg-[rgba(178,201,255,0.1)] supports-backdrop-filter:backdrop-blur-[15px]"
                className="max-h-[calc(100vh-2rem)] gap-10 overflow-y-auto rounded-2xl bg-neutral-50 p-6 shadow-[0px_1px_20px_0px_rgba(123,123,123,0.05),0px_4px_10px_0px_rgba(123,123,123,0.05)] ring-0 sm:max-w-269 lg:p-12"
            >
                <DialogTitle className="sr-only">{candidateName}'s Capability Passport</DialogTitle>

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