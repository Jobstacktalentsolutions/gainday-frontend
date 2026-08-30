import { cn } from "@/lib/utils";


const STEPS = [
    { path: "details", label: "JOB DETAILS", mobileLabel: "Form" },
    { path: "simulation-builder", label: "SIMULATION BUILDER", mobileLabel: "Simulation" },
    { path: "review", label: "REVIEW & PUBLISH", mobileLabel: "Review" },
    { path: "done", label: "DONE", mobileLabel: "Done" },
];

interface JobPostingStepIndicatorProps {
    currentStep: "details" | "simulation-builder" | "review" | "done"
    orientation?: "vertical" | "horizontal"
}

const JobPostingStepIndicator = ({ currentStep, orientation = "vertical" }: JobPostingStepIndicatorProps) => {

    const currentIndex = STEPS.findIndex((s) => s.path === currentStep)

    if (orientation === "horizontal") {
        return (
            <nav aria-label="Job posting progress" className="flex w-full items-center justify-between gap-1">
                {STEPS.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isActive = index === currentIndex;
                    const isFuture = index > currentIndex;
                    const isLast = index === STEPS.length - 1;

                    return (
                        <div key={step.path} className="flex flex-1 items-center gap-1">
                            {/* Circle + label group */}
                            <div className="flex flex-col items-center gap-1">
                                <div
                                    className={cn(
                                        "flex shrink-0 items-center justify-center rounded-full transition-all duration-300",
                                        isActive && "size-4 border-2 border-primary-500 bg-primary-500",
                                        isCompleted && "size-3 border-2 border-primary-500 bg-primary-500",
                                        isFuture && "size-3 border-2 border-neutral-300 bg-transparent",
                                    )}
                                    aria-current={isActive ? "step" : undefined}
                                >
                                    {isActive && (
                                        <div className="size-1 rounded-full bg-white" />
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        "text-[10px] font-medium tracking-wide whitespace-nowrap select-none",
                                        isActive && "text-neutral-950",
                                        isCompleted && "text-neutral-950",
                                        isFuture && "text-neutral-400",
                                    )}
                                >
                                    {step.mobileLabel}
                                </span>
                            </div>

                            {/* Connecting line */}
                            {!isLast && (
                                <div
                                    className={cn(
                                        "mb-4 h-0.5 flex-1 transition-colors duration-300",
                                        index < currentIndex ? "bg-primary-500" : "bg-neutral-200",
                                    )}
                                />
                            )}
                        </div>
                    );
                })}
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