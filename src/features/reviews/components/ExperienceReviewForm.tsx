import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useSubmitExperienceReview } from "../hooks/useExperienceReview";

const STAR_VALUES = [1, 2, 3, 4, 5];
const COMMENT_MAX = 1000;

interface ExperienceReviewFormProps {
    /** The completed assessment being rated. */
    submissionId: string;
    /** Called once the rating has been saved. */
    onSubmitted?: () => void;
    /** Shows a "Skip" button side-by-side with Submit when provided. */
    onSkip?: () => void;
}

const ExperienceReviewForm = ({ submissionId, onSubmitted, onSkip }: ExperienceReviewFormProps) => {
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState("");
    const { mutate, isPending } = useSubmitExperienceReview();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (rating === null || comment.length > COMMENT_MAX) return;

        mutate(
            { submissionId, rating, comment: comment.trim() || undefined },
            {
                onSuccess: () => {
                    toast.success("Thanks for sharing your experience");
                    onSubmitted?.();
                },
                onError: () => toast.error("Couldn't submit your rating. Please try again."),
            },
        );
    };

    return (
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
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
                            className="cursor-pointer rounded-md p-1 outline-none focus-visible:ring-3 focus-visible:ring-primary-500/30"
                        >
                            <Star
                                className={cn("size-8 transition-colors", isFilled ? "fill-amber-400 text-amber-400" : "text-neutral-300")}
                            />
                        </button>
                    );
                })}
            </div>

            {rating !== null && (
                <div className="flex flex-col gap-1.5 text-left">
                    <label htmlFor="experience-review-comment" className="text-sm text-neutral-700">
                        Tell us why you gave this rating
                    </label>
                    <Textarea
                        id="experience-review-comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        placeholder="How can we improve?"
                        rows={3}
                        className="min-h-18 resize-none"
                    />
                </div>
            )}

            <div className="flex w-full items-center justify-center gap-3 pt-2">
                {onSkip && (
                    <ActionButton
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={onSkip}
                        disabled={isPending}
                        className="flex-1"
                    >
                        Skip
                    </ActionButton>
                )}
                <ActionButton
                    type="submit"
                    variant="primary"
                    size="md"
                    className="flex-1"
                    disabled={rating === null || isPending || comment.length > COMMENT_MAX}
                >
                    {isPending ? "Submitting..." : "Submit"}
                </ActionButton>
            </div>
        </form>
    );
};

export default ExperienceReviewForm;
