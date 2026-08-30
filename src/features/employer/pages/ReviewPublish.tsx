// src/features/employer/pages/ReviewPublishStep.tsx
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ReviewPublishStep = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-12">
            {/* Header — centered */}
            <div className="flex flex-col items-center gap-2 text-center">
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
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="h-10 rounded-lg border border-neutral-200 px-4 text-base text-neutral-600"
                >
                    Back
                </button>
                <button
                    type="button"
                    disabled
                    className="flex h-10 cursor-not-allowed items-center gap-2 rounded-lg bg-primary-500 py-1 pl-4 pr-1 text-base text-neutral-50 opacity-70"
                >
                    Continue
                    <span className="flex size-8 items-center justify-center rounded-lg bg-secondary-500 opacity-70">
                        <ArrowRight className="size-4 text-white" aria-hidden="true" />
                    </span>
                </button>
            </div>
        </div>
    );
};

export default ReviewPublishStep;