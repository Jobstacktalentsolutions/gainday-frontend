import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ActionButton } from "@/components/ui/ActionButton";

interface CompleteProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleteProfile: () => void;
}

// Shown in place of starting an application while the candidate's profile is missing the
// required job title (the backend rejects the application too — see SubmissionsService.createSubmission).
export function CompleteProfileDialog({ open, onOpenChange, onCompleteProfile }: CompleteProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-[calc(100%-2rem)] gap-6 overflow-y-auto rounded-2xl p-6 sm:max-w-141.5 sm:gap-10 sm:p-12">
        <DialogHeader className="items-center gap-2 text-center">
          <DialogTitle className="text-2xl leading-8 tracking-[-0.32px] text-primary-950 sm:text-[32px] sm:leading-9.5">
            Complete your profile first
          </DialogTitle>
          <DialogDescription className="text-[16px] text-neutral-700">
            Add your job title so employers know what role you're looking for. It only takes a moment.
          </DialogDescription>
        </DialogHeader>
        <ActionButton variant="primary" size="lg" onClick={onCompleteProfile}>
          Complete profile
        </ActionButton>
      </DialogContent>
    </Dialog>
  );
}
