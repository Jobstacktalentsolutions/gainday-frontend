import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ActionButton } from "@/components/ui/ActionButton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useSubmitExperienceReview } from "../hooks/useExperienceReview";

const STAR_VALUES = [1, 2, 3, 4, 5];
// Ratings at or below this ask the reviewer why.
const LOW_RATING_MAX = 2;

interface ExperienceReviewModalProps {
  onDismiss: () => void;
}

const ExperienceReviewModal = ({ onDismiss }: ExperienceReviewModalProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const { mutate, isPending } = useSubmitExperienceReview();

  const isLowRating = rating !== null && rating <= LOW_RATING_MAX;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rating === null) return;

    const trimmedComment = comment.trim();
    mutate(
      { rating, comment: isLowRating && trimmedComment ? trimmedComment : undefined },
      {
        onSuccess: () => toast.success("Thanks for sharing your experience"),
        onError: () => toast.error("Couldn't submit your rating. Please try again."),
      },
    );
  };

  return (
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
          <DialogDescription>Rate your experience with Gainday.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex items-center justify-center gap-2" role="group" aria-label="Rating">
            {STAR_VALUES.map((value) => {
              const isFilled = rating !== null && value <= rating;
              return (
                <button
                  key={value}
                  type="button"
                  aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  aria-pressed={rating === value}
                  onClick={() => setRating(value)}
                  className="rounded-md p-1 outline-none focus-visible:ring-3 focus-visible:ring-primary-500/30"
                >
                  <Star
                    className={cn(
                      "size-9 transition-colors",
                      isFilled ? "fill-amber-400 text-amber-400" : "text-neutral-300",
                    )}
                  />
                </button>
              );
            })}
          </div>

          {isLowRating && (
            <div className="flex flex-col gap-2">
              <label htmlFor="experience-review-comment" className="text-sm text-neutral-700">
                We'll greatly appreciate why you gave this rating
              </label>
              <Textarea
                id="experience-review-comment"
                value={comment}
                maxLength={1000}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Tell us what didn't work for you"
              />
            </div>
          )}

          <ActionButton type="submit" className="w-full" disabled={rating === null || isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </ActionButton>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExperienceReviewModal;
