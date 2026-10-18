import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ActionButton } from "@/components/ui/ActionButton";

interface CompleteProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleteProfile: () => void;
}

// Shown in place of starting an application while the candidate's profile is missing the
// required pronouns (the backend rejects the application too — see SubmissionsService.createSubmission).
export function CompleteProfileDialog({ open, onOpenChange, onCompleteProfile }: CompleteProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-141.5 gap-10 rounded-2xl p-12">
        <DialogHeader className="items-center gap-2 text-center">
          <DialogTitle className="text-[32px] leading-9.5 tracking-[-0.32px] text-primary-950">
            Complete your profile first
          </DialogTitle>
          <DialogDescription className="text-[16px] text-neutral-700">
            Add your pronouns so employers address you correctly. It only takes a moment.
          </DialogDescription>
        </DialogHeader>
        <ActionButton variant="primary" size="lg" onClick={onCompleteProfile}>
          Complete profile
        </ActionButton>
      </DialogContent>
    </Dialog>
  );
}
