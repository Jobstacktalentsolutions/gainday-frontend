// src/features/employer/pages/ReviewPublishStep.tsx
import { useNavigate } from "react-router-dom";
import { StepSecondaryButton, StepContinueButton } from "@/components/ui/StepNavigationButtons";

const ReviewPublishStep = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-12">
            {/* Header — centered */}
            <div className="flex flex-col lg:items-center gap-2 text-left lg:text-center">
                <h1 className="text-3xl font-bold text-black lg:text-4xl">Review and Publish</h1>
                <p className="max-w-lg text-base text-neutral-500">
                    Check everything below before this goes live on the Gainday board.
                </p>
            </div>

            {/* shell */}
            <div className="flex min-h-158.25 w-full items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-white">
                <p className="text-base text-neutral-400">Review & Publish — coming soon</p>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
                <StepSecondaryButton onClick={() => navigate(-1)}>
                    Back
                </StepSecondaryButton>
                <StepContinueButton disabled>
                    Publish job
                </StepContinueButton>
            </div>
        </div>
    );
};

export default ReviewPublishStep;