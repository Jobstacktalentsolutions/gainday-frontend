import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatShortDate } from "@/lib/formatDate";
import { buildApplicationTimeline } from "../utils/applicationTimeline";
import type { Application } from "../types/application";

const ApplicationTimeline = ({ application }: { application: Application }) => {
    const steps = buildApplicationTimeline(application);

    return (
        <ol className="flex flex-col">
            {steps.map((step, index) => {
                const isLast = index === steps.length - 1;
                const isComplete = step.state === "complete";
                const isCurrent = step.state === "current";
                const isUpcoming = step.state === "upcoming";

                return (
                    <li key={step.key} className="flex gap-4" aria-current={isCurrent ? "step" : undefined}>
                        <div className="flex flex-col items-center">
                            <span
                                className={cn(
                                    "flex size-8 shrink-0 items-center justify-center rounded-full border-2",
                                    isComplete && "border-primary-500 bg-primary-500 text-white",
                                    isCurrent && "border-primary-500 bg-white",
                                    isUpcoming && "border-neutral-200 bg-neutral-50",
                                )}
                            >
                                {isComplete && <Check className="size-4" strokeWidth={3} aria-hidden="true" />}
                                {isCurrent && <span className="size-2.5 rounded-full bg-primary-500" />}
                            </span>
                            {!isLast && (
                                <span
                                    className={cn(
                                        "my-1 min-h-8 w-0.5 flex-1",
                                        // The connector leads to the next step, so it's coloured once that one is reached.
                                        steps[index + 1].state === "upcoming" ? "bg-neutral-200" : "bg-primary-500",
                                    )}
                                />
                            )}
                        </div>

                        <div className={cn("flex flex-col gap-0.5", !isLast && "pb-6")}>
                            <p className={cn("text-lg", isUpcoming ? "text-neutral-400" : "text-neutral-900")}>
                                {step.label}
                            </p>
                            <p className={cn("text-base", isUpcoming ? "text-neutral-400" : "text-neutral-700")}>
                                {step.description}
                            </p>
                            {step.date && <p className="text-sm text-neutral-500">{formatShortDate(step.date)}</p>}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
};

export default ApplicationTimeline;
