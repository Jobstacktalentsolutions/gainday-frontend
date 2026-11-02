import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ExperienceReviewForm from "./ExperienceReviewForm";

interface ExperienceReviewModalProps {
  onDismiss: () => void;
}

const ExperienceReviewModal = ({ onDismiss }: ExperienceReviewModalProps) => (
  // Only the X closes the modal. Escape and clicks outside are ignored, so the rating can't be skipped by accident.
  <Dialog
    open
    onOpenChange={(open, details) => {
      if (!open && details.reason === "close-press") onDismiss();
    }}
  >
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>How was your experience?</DialogTitle>
        <DialogDescription>Please rate your experience using Gainday and tell us why you gave the score.</DialogDescription>
      </DialogHeader>
      <ExperienceReviewForm />
    </DialogContent>
  </Dialog>
);

export default ExperienceReviewModal;