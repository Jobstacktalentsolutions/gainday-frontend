import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ActionButton } from "@/components/ui/ActionButton";

interface ApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignUp: () => void;
}

export function ApplyDialog({ open, onOpenChange, onSignUp }: ApplyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-141.5 gap-15 rounded-2xl p-12">
        <DialogHeader className="items-center gap-2 text-center">
          <DialogTitle className="text-[32px] leading-9.5 tracking-[-0.32px] text-primary-950">
            How would you like to apply?
          </DialogTitle>
          <DialogDescription className="text-[16px] text-neutral-700">
            Apply and start building your capability passport.
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-col gap-4">
          <ActionButton variant="primary" size="lg" onClick={onSignUp}>
            Sign up to apply
          </ActionButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}