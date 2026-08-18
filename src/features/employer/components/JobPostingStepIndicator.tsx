import { cn } from "@/lib/utils";


const STEPS = [
    { path: "details", label: "JOB DETAILS" },
    { path: "simulation-builder", label: "SIMULATION BUILDER" },
    { path: "review", label: "REVIEW & PUBLISH" },
];

interface JobPostingStepIndicatorProps {
    currentStep: "details" | "simulation-builder" | "review"
}

const JobPostingStepIndicator = ({ currentStep }: JobPostingStepIndicatorProps) => {

    const currentIndex = STEPS.findIndex((s) => s.path === currentStep)

    return (
        <div className="flex w-full items-center gap-3">
            {STEPS.map((step, index) => (
                <div
                    key={step.path}
                    className="flex flex-1 flex-col items-center justify-center gap-3">
                    <div className={cn("h-px w-full", index <= currentIndex ? "bg-neutral-950" : "bg-neutral-200")} />
                </div>
            ))}
        </div>
    );
}

export default JobPostingStepIndicator;