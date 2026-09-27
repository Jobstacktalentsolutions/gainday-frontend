import { useNavigate } from "react-router-dom";
import { ActionButton } from "@/components/ui/ActionButton";

interface SimulationCompleteModalProps {
    timeLimitMinutes: number;
}

export function SimulationCompleteModal({ timeLimitMinutes }: SimulationCompleteModalProps) {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[rgba(178,201,255,0.1)] backdrop-blur-[15px]">
            <div className="flex w-141.5 max-w-[90vw] flex-col items-center gap-15 rounded-2xl bg-white p-12 shadow-[0px_1px_20px_rgba(123,123,123,0.05),0px_4px_10px_rgba(123,123,123,0.05)]">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h2 className="text-[32px] leading-9.5 tracking-[-0.32px] text-primary-950">
                        Your simulation is complete
                    </h2>
                    <p className="text-[16px] text-neutral-700">
                        Your {timeLimitMinutes}-minute allocation ended. All saved answers are now locked and have been
                        submitted for evaluation.
                    </p>
                </div>
                <ActionButton variant="primary" size="lg" onClick={() => navigate("/job-board")}>
                    Return to job board
                </ActionButton>
            </div>
        </div>
    );
}