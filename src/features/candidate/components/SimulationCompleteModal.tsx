import { useNavigate } from "react-router-dom";
import { Lottie } from "lottie-react";
import { Mail } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import spinner from "@/assets/Spinner.svg";
import timerAnimation from "@/assets/lottie/timer-animation.json";
import successAnimation from "@/assets/lottie/success.json";

interface SimulationCompleteModalProps {
    reason: "timeout" | "manual";
    timeLimitMinutes: number;
    tasksSubmittedCount: number;
    totalTaskCount: number;
    elapsedSeconds: number;
    submitStatus: "pending" | "error" | "done";
    onRetry?: () => void;
}

function formatElapsed(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function SimulationCompleteModal({
    reason,
    timeLimitMinutes,
    tasksSubmittedCount,
    totalTaskCount,
    elapsedSeconds,
    submitStatus,
    onRetry,
}: SimulationCompleteModalProps) {
    const navigate = useNavigate();
    const isTimeout = reason === "timeout";

    return (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[rgba(178,201,255,0.1)] backdrop-blur-[15px]">
            <div className="flex w-141.5 max-w-[90vw] flex-col items-center gap-10 rounded-2xl bg-white p-12 shadow-[0px_1px_20px_rgba(123,123,123,0.05),0px_4px_10px_rgba(123,123,123,0.05)]">
                <Lottie src={isTimeout ? timerAnimation : successAnimation} autoplay loop={false} className="size-37.5" />

                <div className="flex flex-col items-center gap-2 text-center">
                    <h2 className="text-[32px] leading-9.5 tracking-[-0.32px] text-primary-950">
                        {isTimeout ? "Time is up!" : "Submission Received"}
                    </h2>
                    {submitStatus === "error" ? (
                        <p role="alert" className="text-[16px] text-error-600">
                            Your {timeLimitMinutes}-minute allocation ended and your answers are saved on this device, but we
                            couldn't reach Gainday to submit them for evaluation. Please retry before closing this tab.
                        </p>
                    ) : (
                        <p className="text-[16px] text-neutral-700">
                            {isTimeout
                                ? "We submitted what you had completed. Your Capability Passport will update once all applications have been scored."
                                : "Your work is safely submitted. All responses are locked and queued for consistent review against the role's capability criteria."}
                        </p>
                    )}
                </div>

                {submitStatus !== "error" && (
                    <div className="flex w-full gap-3">
                        <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-primary-200 bg-white/10 px-3 py-6">
                            <p className="text-[32px] leading-9.5 tracking-[-0.32px] text-black">
                                {tasksSubmittedCount}/{totalTaskCount}
                            </p>
                            <p className="text-[16px] text-neutral-700">TASKS SUBMITTED</p>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-primary-200 bg-white/10 px-3 py-6">
                            <p className="text-[32px] leading-9.5 tracking-[-0.32px] text-black">
                                {isTimeout ? `${timeLimitMinutes}:00` : `${formatElapsed(elapsedSeconds)}/${timeLimitMinutes}:00`}
                            </p>
                            <p className="text-[16px] text-neutral-700">TIME ALLOCATION</p>
                        </div>
                    </div>
                )}

                {submitStatus !== "error" && (
                    <div className="flex w-full flex-col gap-2.5 border-l-3 border-primary-500 bg-primary-50 p-4">
                        <div className="flex items-center gap-2.5">
                            <Mail className="size-6 text-primary-950" />
                            <p className="text-[16px] text-primary-950">Your results will arrive by email</p>
                        </div>
                        <p className="text-[16px] text-neutral-700">
                            We'll email your score breakdown and feedback when the review is complete. Your updated Capability
                            Score will also be available in your account.
                        </p>
                    </div>
                )}

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
                        {submitStatus === "pending" && <img src={spinner} alt="" className="h-4 w-4 animate-spin" />}
                        Return to job board
                    </ActionButton>
                )}
            </div>
        </div>
    );
}