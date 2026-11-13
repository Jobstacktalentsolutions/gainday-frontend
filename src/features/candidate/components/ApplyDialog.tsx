import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ActionButton } from "@/components/ui/ActionButton";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

interface ApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignUp: () => void;
  onSignIn: () => void;
}

export function ApplyDialog({ open, onOpenChange, onSignUp, onSignIn }: ApplyDialogProps) {
  const { isAuthenticated } = useCurrentUser();

  if (isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-[calc(100%-2rem)] gap-6 overflow-y-auto rounded-2xl p-6 sm:max-w-141.5 sm:gap-10 sm:p-12">
        <DialogHeader className="items-center gap-2 text-center">
          <DialogTitle className="text-2xl leading-8 tracking-[-0.32px] text-primary-950 sm:text-[32px] sm:leading-9.5">
            Apply and start building your capability passport
          </DialogTitle>
          <DialogDescription className="sr-only">
            Create an account or sign in to apply for this role.
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-col items-center gap-4">
          <ActionButton variant="primary" size="lg" className="w-full" onClick={onSignUp}>
            Sign up to apply
          </ActionButton>
          <p className="text-base text-neutral-700">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSignIn}
              className="cursor-pointer font-medium text-primary-500 underline underline-offset-2 transition-colors hover:text-primary-700"
            >
              Sign in
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
