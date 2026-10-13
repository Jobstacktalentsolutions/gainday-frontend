import { useNavigate } from "react-router-dom";
import { ActionButton } from "@/components/ui/ActionButton";
import spinner from "@/assets/Spinner.svg";

interface SimulationCompleteModalProps {
    timeLimitMinutes: number;
    /** "pending" while the final PUT /submissions/:id/submit is in flight, "error" if it
     *  failed (answers are still safe locally — see useSimulationRunStore's persist), "done"
     *  once it succeeded. */
    submitStatus: "pending" | "error" | "done";
    onRetry?: () => void;
}

export function SimulationCompleteModal({ timeLimitMinutes, submitStatus, onRetry }: SimulationCompleteModalProps) {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[rgba(178,201,255,0.1)] backdrop-blur-[15px]">
            <div className="flex w-141.5 max-w-[90vw] flex-col items-center gap-15 rounded-2xl bg-white p-12 shadow-[0px_1px_20px_rgba(123,123,123,0.05),0px_4px_10px_rgba(123,123,123,0.05)]">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h2 className="text-[32px] leading-9.5 tracking-[-0.32px] text-primary-950">
                        Your simulation is complete
                    </h2>
                    {submitStatus === "error" ? (
                        <p role="alert" className="text-[16px] text-error-600">
                            Your {timeLimitMinutes}-minute allocation ended and your answers are saved on this device,
                            but we couldn't reach Gainday to submit them for evaluation. Please retry before closing this
                            tab.
                        </p>
                    ) : (
                        <p className="text-[16px] text-neutral-700">
                            Your {timeLimitMinutes}-minute allocation ended. All saved answers are now locked and{" "}
                            {submitStatus === "pending" ? "are being submitted for evaluation." : "have been submitted for evaluation."}
                        </p>
                    )}
                </div>
                {submitStatus === "error" && onRetry ? (
                    <ActionButton variant="primary" size="lg" onClick={onRetry}>
                        Retry submission
                    </ActionButton>
                ) : (
                    <ActionButton
                        variant="primary"
                        size="lg"
                        disabled={submitStatus === "pending"}
                        onClick={() => navigate("/job-board")}
                    >
                        {submitStatus === "pending" && (
                            <img src={spinner} alt="" className="h-4 w-4 animate-spin" />
                        )}
                        Return to job board
                    </ActionButton>
                )}
            </div>
        </div>
    );
}