
import { AdminButton } from "@/components/ui/AdminButton";
import type { GeneratedSimulation } from "../types/aiOversight";

interface ViewSimulationDialogProps {
    simulation: GeneratedSimulation | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const STATUS_LABELS: Record<GeneratedSimulation["status"], string> = {
    live: "Live",
    draft: "Draft",
    archived: "Archived",
};

const STATUS_STYLES: Record<GeneratedSimulation["status"], string> = {
    live: "bg-success-50 text-success-600 border border-success-200",
    draft: "bg-warning-50 text-warning-600 border border-warning-200",
    archived: "bg-neutral-100 text-neutral-500 border border-neutral-200",
};

const ViewSimulationDialog = ({
    simulation,
    open,
    onOpenChange,
}: ViewSimulationDialogProps) => {
    if (!open || !simulation) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="view-sim-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-md rounded-xl border border-neutral-200 bg-white shadow-xl">
                <div className="flex items-start justify-between border-b border-neutral-100 px-6 py-5">
                    <div>
                        <h2
                            id="view-sim-title"
                            className="text-base font-semibold text-neutral-900"
                        >
                            Simulation Details
                        </h2>
                        <p className="mt-0.5 text-sm text-neutral-500">{simulation.jobTitle}</p>
                    </div>
                    <button
                        type="button"
                        aria-label="Close dialog"
                        onClick={() => onOpenChange(false)}
                        className="rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col gap-4 px-6 py-5">
                    <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3">
                        <span className="text-sm font-medium text-neutral-600">Status</span>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[simulation.status]}`}>
                            {STATUS_LABELS[simulation.status]}
                        </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3">
                        <span className="text-sm font-medium text-neutral-600">Task count</span>
                        <span className="text-sm font-semibold text-neutral-900">{simulation.taskCount} tasks</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3">
                        <span className="text-sm font-medium text-neutral-600">Job ID</span>
                        <span className="font-mono text-xs text-neutral-500">{simulation.jobId}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3">
                        <span className="text-sm font-medium text-neutral-600">Generated</span>
                        <span className="text-sm text-neutral-500">
                            {new Date(simulation.generatedAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                </div>

                <div className="border-t border-neutral-100 px-6 py-4">
                    <AdminButton
                        variant="outline"
                        className="w-full"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </AdminButton>
                </div>
            </div>
        </div>
    );
};

export default ViewSimulationDialog;
