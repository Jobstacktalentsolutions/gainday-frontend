import { useState, useEffect } from "react";
import { AdminButton } from "@/components/ui/AdminButton";
import { cn } from "@/lib/utils";
import type { GeneratedSimulation } from "../types/aiOversight";

interface OverrideSimulationDialogProps {
    simulation: GeneratedSimulation | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (payload: {
        id: string;
        taskCount: number;
        status: GeneratedSimulation["status"];
    }) => void;
    isPending: boolean;
}

const STATUS_OPTIONS: { label: string; value: GeneratedSimulation["status"] }[] = [
    { label: "Live", value: "live" },
    { label: "Draft", value: "draft" },
    { label: "Archived", value: "archived" },
];

const OverrideSimulationDialog = ({
    simulation,
    open,
    onOpenChange,
    onConfirm,
    isPending,
}: OverrideSimulationDialogProps) => {
    const [taskCount, setTaskCount] = useState(4);
    const [status, setStatus] = useState<GeneratedSimulation["status"]>("live");

    useEffect(() => {
        if (simulation) {
            setTaskCount(simulation.taskCount);
            setStatus(simulation.status);
        }
    }, [simulation]);

    if (!open || !simulation) return null;

    const handleConfirm = () => {
        onConfirm({ id: simulation.id, taskCount, status });
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="override-sim-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm"
                onClick={() => !isPending && onOpenChange(false)}
            />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-md rounded-xl border border-neutral-200 bg-white shadow-xl">
                <div className="flex items-start justify-between border-b border-neutral-100 px-6 py-5">
                    <div>
                        <h2
                            id="override-sim-title"
                            className="text-base font-semibold text-neutral-900"
                        >
                            Override Simulation
                        </h2>
                        <p className="mt-0.5 text-sm text-neutral-500">{simulation.jobTitle}</p>
                    </div>
                    <button
                        type="button"
                        aria-label="Close dialog"
                        disabled={isPending}
                        onClick={() => onOpenChange(false)}
                        className="cursor-pointer rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-40"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col gap-5 px-6 py-5">
                    {/* Task Count */}
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="override-task-count"
                            className="text-sm font-medium text-neutral-700"
                        >
                            Number of tasks
                        </label>
                        <input
                            id="override-task-count"
                            type="number"
                            min={1}
                            max={10}
                            value={taskCount}
                            onChange={(e) => setTaskCount(Number(e.target.value))}
                            className="h-9 w-full rounded-md border border-neutral-200 px-3 text-sm text-neutral-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        />
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-1.5">
                        <p className="text-sm font-medium text-neutral-700">Status</p>
                        <div className="flex gap-2">
                            {STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setStatus(opt.value)}
                                    className={cn(
                                        "flex-1 cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                                        status === opt.value
                                            ? "border-primary-500 bg-primary-50 text-primary-700"
                                            : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Warning note */}
                    <div className="flex gap-2.5 rounded-lg border border-warning-200 bg-warning-50 px-4 py-3">
                        <svg className="mt-0.5 size-4 shrink-0 text-warning-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <p className="text-xs text-warning-700">
                            Overriding this simulation will immediately affect candidates viewing this job. Proceed with care.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-neutral-100 px-6 py-4">
                    <AdminButton
                        variant="outline"
                        disabled={isPending}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </AdminButton>
                    <AdminButton
                        variant="primary"
                        disabled={isPending}
                        onClick={handleConfirm}
                    >
                        {isPending ? "Saving…" : "Apply Override"}
                    </AdminButton>
                </div>
            </div>
        </div>
    );
};

export default OverrideSimulationDialog;
