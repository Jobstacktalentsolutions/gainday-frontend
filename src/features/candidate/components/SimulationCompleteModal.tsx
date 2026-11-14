import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ActionButton } from "@/components/ui/ActionButton";
import ExperienceReviewForm from "@/features/reviews/components/ExperienceReviewForm";
import { useSimulationRunStore } from "@/features/candidate/store/useSimulationRunStore";
import spinner from "@/assets/Spinner.svg";

interface SimulationCompleteModalProps {
    timeLimitMinutes: number;
    /** The submission just completed. Once it has submitted, the candidate is asked to rate it. */
    submissionId: string | null;
    /** "pending" while the final PUT /submissions/:id/submit is in flight, "error" if it
     *  failed (answers are still safe locally — see useSimulationRunStore's persist), "done"
     *  once it succeeded. */
    submitStatus: "pending" | "error" | "done";
    onRetry?: () => void;
}

export function SimulationCompleteModal({
    timeLimitMinutes,
    submissionId,
    submitStatus,
    onRetry,
}: SimulationCompleteModalProps) {
    const navigate = useNavigate();

    const showReview = submitStatus === "done" && submissionId !== null;

    useEffect(() => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        }
    }, []);

    const handleReturn = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        }
        useSimulationRunStore.getState().resetRun();
        navigate("/job-board");
    };

    return (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[rgba(178,201,255,0.1)] p-4 backdrop-blur-[15px]">
            <div className="flex w-full max-w-lg flex-col items-center gap-6 rounded-2xl bg-white p-6 shadow-[0px_1px_20px_rgba(123,123,123,0.05),0px_4px_10px_rgba(123,123,123,0.05)] sm:p-8">
                <div className="flex flex-col items-center gap-1.5 text-center">
                    <h2 className="text-2xl font-semibold leading-tight tracking-tight text-primary-950 sm:text-[26px]">
                        Your assessment task is complete
                    </h2>
                    {submitStatus === "error" ? (
                        <p role="alert" className="text-sm text-error-600 sm:text-base">
                            Your {timeLimitMinutes}-minute allocation ended and your answers are saved on this device,
                            but we couldn't reach Gainday to submit them for evaluation. Please retry before closing this
                            tab.
                        </p>
                    ) : submitStatus === "pending" ? (
                        <p className="text-sm text-neutral-700 sm:text-base">
                            We're submitting your answers. Please keep this page open.
                        </p>
                    ) : (
                        <p className="text-sm text-neutral-700 sm:text-base">
                            You have successfully applied for the role. You will be contacted by the employer if
                            you've been selected for the next stage.
                        </p>
                    )}
                </div>

                {showReview ? (
                    <div className="flex w-full flex-col items-center gap-3 border-t border-neutral-200 pt-5 text-center">
                        <p className="text-base font-medium text-neutral-900">
                            Please rate your experience using Gainday.
                        </p>
                        <ExperienceReviewForm
                            submissionId={submissionId}
                            onSubmitted={handleReturn}
                            onSkip={handleReturn}
                        />
                    </div>
                ) : submitStatus === "error" && onRetry ? (
                    <ActionButton gradient={false} variant="primary" size="md" onClick={onRetry} className="w-full">
                        Retry submission
                    </ActionButton>
                ) : submitStatus === "pending" ? (
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <img src={spinner} alt="" className="h-5 w-5 animate-spin" />
                        <span>Submitting assessment...</span>
                    </div>
                ) : (
                    <ActionButton gradient={false}
                        variant="primary"
                        size="md"
                        onClick={handleReturn}
                        className="w-full"
                    >
                        Return to job board
                    </ActionButton>
                )}
            </div>
        </div>
    );
}
