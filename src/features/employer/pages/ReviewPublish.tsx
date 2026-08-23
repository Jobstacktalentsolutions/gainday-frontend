// src/features/employer/pages/ReviewPublishStep.tsx
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import JobPostingStepIndicator from "../components/JobPostingStepIndicator";

const ReviewPublishStep = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-50 px-6 pb-10 pt-34.74">
            <div className="mx-auto flex w-full max-w-85.5 flex-col gap-10.75">
                <div className="flex flex-col gap-3">

                    <div>
                        <h1 className="text-2xl text-black">Post a job</h1>
                        <p className="text-base text-neutral-700">
                            Gainday decomposes the role, maps it to measurable capabilities, generates a work
                            assessment and quality checks it. Nothing reaches the candidate until you approve it
                        </p>
                    </div>
                </div>

                <JobPostingStepIndicator currentStep="review" />

                <div className="flex flex-col items-center gap-2 text-center">
                    <h2 className="text-2xl text-black">Review and Publish</h2>
                    <p className="text-base text-neutral-700">
                        Check everything below before this goes live on the Gainday board.
                    </p>
                </div>

                {/* shell */}
                <div className="flex min-h-158.25 w-full items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-white">
                    <p className="text-base text-neutral-400">Review & Publish — coming soon</p>
                </div>

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
        </div>
    );
};

export default ReviewPublishStep;