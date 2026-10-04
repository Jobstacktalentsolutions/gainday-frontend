import { AdminButton } from "@/components/ui/AdminButton";
import { cn } from "@/lib/utils";
import type { GeneratedSimulation } from "../types/aiOversight";

interface GeneratedSimulationsPanelProps {
    simulations: GeneratedSimulation[];
    onView: (simulation: GeneratedSimulation) => void;
    onRegenerate: (simulation: GeneratedSimulation) => void;
    onOverride: (simulation: GeneratedSimulation) => void;
    regeneratingId: string | null;
}

const STATUS_LABELS: Record<GeneratedSimulation["status"], string> = {
    live: "Live",
    draft: "Draft",
    archived: "Archived",
};

const STATUS_DOT_STYLES: Record<GeneratedSimulation["status"], string> = {
    live: "bg-success-500",
    draft: "bg-warning-500",
    archived: "bg-neutral-400",
};

const GeneratedSimulationsPanel = ({
    simulations,
    onView,
    onRegenerate,
    onOverride,
    regeneratingId,
}: GeneratedSimulationsPanelProps) => {
    return (
        <section className="flex w-full flex-col gap-0 overflow-hidden rounded-[10px] border border-neutral-200 bg-white">
            <div className="px-5 py-4 border-b border-neutral-100">
                <p className="text-base font-semibold text-neutral-900">Generated Simulations</p>
            </div>

            {simulations.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-neutral-500">
                    No simulations generated yet.
                </p>
            )}

            {simulations.map((sim, index) => (
                <div
                    key={sim.id}
                    onClick={() => onView(sim)}
                    className={cn(
                        "flex w-full items-center gap-4 px-5 py-4 transition-colors hover:bg-neutral-50 cursor-pointer",
                        index !== simulations.length - 1 && "border-b border-neutral-100"
                    )}
                >
                    {/* Info */}
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <p className="truncate text-sm font-medium text-neutral-900">
                            {sim.jobTitle}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-500">
                                {sim.taskCount} tasks
                            </span>
                            <span className="text-neutral-300">·</span>
                            <span
                                className={cn(
                                    "inline-flex items-center gap-1.5 text-xs font-medium",
                                    sim.status === "live" ? "text-success-600" :
                                    sim.status === "draft" ? "text-warning-600" :
                                    "text-neutral-500"
                                )}
                            >
                                <span className={cn("size-1.5 rounded-full", STATUS_DOT_STYLES[sim.status])} />
                                {STATUS_LABELS[sim.status]}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <AdminButton
                            id={`regenerate-sim-${sim.id}`}
                            variant="outline"
                            size="sm"
                            disabled={regeneratingId === sim.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                onRegenerate(sim);
                            }}
                        >
                            {regeneratingId === sim.id ? (
                                <span className="flex items-center gap-1.5">
                                    <svg className="size-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                    Regenerating…
                                </span>
                            ) : "Regenerate"}
                        </AdminButton>
                        <AdminButton
                            id={`override-sim-${sim.id}`}
                            variant="primary"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOverride(sim);
                            }}
                        >
                            Override
                        </AdminButton>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default GeneratedSimulationsPanel;
