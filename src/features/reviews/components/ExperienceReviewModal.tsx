import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ExperienceReviewForm from "./ExperienceReviewForm";

interface ExperienceReviewModalProps {
    /** The completed assessment being rated. */
    submissionId: string;
    /** Called after the rating is saved, or when the X is pressed. */
    onClose: () => void;
}

const ExperienceReviewModal = ({ submissionId, onClose }: ExperienceReviewModalProps) => (
    // Only the X closes the modal. Escape and clicks outside are ignored, so the rating can't be skipped by accident.
    <Dialog
        open
        onOpenChange={(open, details) => {
            if (!open && details.reason === "close-press") onClose();
        }}
    >
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>How was your experience?</DialogTitle>
                <DialogDescription>
                    Please rate your experience using Gainday and tell us why you gave the score.
                </DialogDescription>
            </DialogHeader>
            <ExperienceReviewForm submissionId={submissionId} onSubmitted={onClose} />
        </DialogContent>
    </Dialog>
);

export default ExperienceReviewModal;
