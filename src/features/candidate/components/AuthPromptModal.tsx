import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { ActionButton } from "@/components/ui/ActionButton"

interface AuthPromptModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSignUp: () => void;
    onContinueAsGuest: () => void;
}


export function AuthPromptModal({
    open,
    onOpenChange,
    onSignUp,
    onContinueAsGuest,
}: AuthPromptModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-125 gap-10 rounded-2xl px-6 py-12">
                <DialogHeader className="items-center gap-2 text-center">
                    <DialogTitle className="text-[32px] leading-[1.2] text-primary-950 sm:text-[48px] sm:leading-14.5 sm:tracking-[-0.48px]">
                        How would you like to apply?
                    </DialogTitle>
                    <DialogDescription className="text-[16px] text-neutral-700">
                        Both paths lead to the same work simulation.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex w-full flex-col gap-4">
                    <ActionButton variant="primary" size="lg" onClick={onSignUp}>
                        Sign up to apply
                    </ActionButton>
                    <ActionButton variant="outline" size="lg" onClick={onContinueAsGuest}>
                        Continue as guest
                    </ActionButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}