import { cn } from "@/lib/utils";


const STEPS = [
    { path: "details", label: "JOB DETAILS" },
    { path: "simulation-builder", label: "SIMULATION BUILDER" },
    { path: "review", label: "REVIEW & PUBLISH" },
    { path: "done", label: "DONE" },
];

interface JobPostingStepIndicatorProps {
    currentStep: "details" | "simulation-builder" | "review" | "done"
    orientation?: "vertical" | "horizontal"
}

const JobPostingStepIndicator = ({ currentStep, orientation = "vertical" }: JobPostingStepIndicatorProps) => {

    const currentIndex = STEPS.findIndex((s) => s.path === currentStep)

    if (orientation === "horizontal") {
        const totalSteps = STEPS.length;
        const stepNumber = currentIndex + 1;
        const nextStep = currentIndex < STEPS.length - 1 ? STEPS[currentIndex + 1] : null;

        // SVG circle math
        const size = 48;
        const strokeWidth = 3;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const progress = stepNumber / totalSteps;
        const dashOffset = circumference * (1 - progress);

        return (
            <nav aria-label="Job posting progress" className="flex items-center gap-3">
                {/* Circular progress ring */}
                <div className="relative flex shrink-0 items-center justify-center">
                    <svg width={size} height={size} className="-rotate-90">
                        {/* Background track */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            className="text-neutral-200"
                        />
                        {/* Progress arc */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            className="text-primary-500 transition-all duration-500"
                        />
                    </svg>
                    {/* Step counter */}
                    <span className="absolute text-xs font-bold text-neutral-950">
                        {stepNumber} of {totalSteps}
                    </span>
                </div>

                {/* Step title + next step */}
                <div className="flex flex-col">
                    <span className="text-base font-bold text-neutral-950">
                        {STEPS[currentIndex].label}
                    </span>
                    {nextStep && (
                        <span className="text-xs text-neutral-400">
                            Next: {nextStep.label}
                        </span>
                    )}
                </div>
            </nav>
        );
    }

    // Vertical (desktop) layout
    return (
        <nav aria-label="Job posting progress" className="flex flex-col gap-0">
            {STEPS.map((step, index) => {
                const isCompleted = index < currentIndex;
                const isActive = index === currentIndex;
                const isFuture = index > currentIndex;
                const isLast = index === STEPS.length - 1;

                const lineColor = index < currentIndex ? "bg-primary-500" : "bg-neutral-200";

                return (
                    <div key={step.path} className="flex items-start gap-3">
                        {/* Circle + Line column */}
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    "flex shrink-0 items-center justify-center rounded-full transition-all duration-300",
                                    isActive && "size-5 border-2 border-primary-500 bg-primary-500",
                                    isCompleted && "size-3.5 border-2 border-primary-500 bg-primary-500 mt-0.75",
                                    isFuture && "size-3.5 border-2 border-neutral-300 bg-transparent mt-0.75",
                                )}
                                aria-current={isActive ? "step" : undefined}
                            >
                                {isActive && (
                                    <div className="size-1.5 rounded-full bg-white" />
                                )}
                            </div>

                            {!isLast && (
                                <div
                                    className={cn(
                                        "w-0.5 transition-colors duration-300",
                                        isActive ? "h-10" : "h-8",
                                        lineColor,
                                    )}
                                />
                            )}
                        </div>

                        {/* Step label */}
                        <span
                            className={cn(
                                "text-xs font-medium tracking-wide leading-5 select-none",
                                isActive && "text-neutral-950",
                                isCompleted && "text-neutral-950",
                                isFuture && "text-neutral-400",
                            )}
                        >
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </nav>
    );
}

export default JobPostingStepIndicator;