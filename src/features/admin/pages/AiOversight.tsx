import { useState } from "react";
import {
    useGeneratedSimulations,
    useRegenerateSimulation,
    useOverrideSimulation,
    useFailedScoringSubmissions,
    useRetryScoring,
} from "../hooks/useAiOversight";
import GeneratedSimulationsPanel from "../components/GeneratedSimulationsPanel";
import FailedScoringPanel from "../components/FailedScoringPanel";
import ViewSimulationDialog from "../components/ViewSimulationDialog";
import OverrideSimulationDialog from "../components/OverrideSimulationDialog";
import type { GeneratedSimulation } from "../types/aiOversight";

const AiOversight = () => {
    // ── Data ─────────────────────────────────────────────────────────────────
    const {
        data: simulations,
        isLoading: simsLoading,
        isError: simsError,
    } = useGeneratedSimulations();

    const {
        data: failedSubmissions,
        isLoading: failedLoading,
        isError: failedError,
    } = useFailedScoringSubmissions();

    // ── Mutations ─────────────────────────────────────────────────────────────
    const regenerateMutation = useRegenerateSimulation();
    const overrideMutation = useOverrideSimulation();
    const retryMutation = useRetryScoring();

    // ── Dialog state ─────────────────────────────────────────────────────────
    const [viewSim, setViewSim] = useState<GeneratedSimulation | null>(null);
    const [overrideSim, setOverrideSim] = useState<GeneratedSimulation | null>(null);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleRegenerate = (sim: GeneratedSimulation) => {
        regenerateMutation.mutate(sim.id);
    };

    const handleOverrideConfirm = (payload: {
        id: string;
        taskCount: number;
        status: GeneratedSimulation["status"];
    }) => {
        overrideMutation.mutate(payload, {
            onSuccess: () => setOverrideSim(null),
        });
    };

    const handleRetry = (submission: { id: string }) => {
        retryMutation.mutate(submission.id);
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <>
            <h1 className="text-2xl font-semibold text-neutral-900">AI Engine Oversight</h1>

            {/* Generated Simulations */}
            {simsLoading && (
                <div className="w-full rounded-[10px] border border-neutral-200 bg-white px-5 py-10 text-center text-sm text-neutral-500">
                    Loading simulations…
                </div>
            )}

            {simsError && (
                <div className="w-full rounded-[10px] border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
                    Something went wrong loading generated simulations.
                </div>
            )}

            {!simsLoading && !simsError && (
                <GeneratedSimulationsPanel
                    simulations={simulations ?? []}
                    onView={setViewSim}
                    onRegenerate={handleRegenerate}
                    onOverride={setOverrideSim}
                    regeneratingId={
                        regenerateMutation.isPending
                            ? (regenerateMutation.variables as string)
                            : null
                    }
                />
            )}

            {/* Failed Scoring Submissions */}
            {failedLoading && (
                <div className="w-full rounded-[10px] border border-neutral-200 bg-white px-5 py-10 text-center text-sm text-neutral-500">
                    Loading failed scoring submissions…
                </div>
            )}

            {failedError && (
                <div className="w-full rounded-[10px] border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
                    Something went wrong loading failed scoring submissions.
                </div>
            )}

            {!failedLoading && !failedError && (
                <FailedScoringPanel
                    submissions={failedSubmissions ?? []}
                    onRetry={handleRetry}
                    retryingId={
                        retryMutation.isPending
                            ? (retryMutation.variables as string)
                            : null
                    }
                />
            )}

            {/* Dialogs */}
            <ViewSimulationDialog
                simulation={viewSim}
                open={viewSim !== null}
                onOpenChange={(open) => !open && setViewSim(null)}
                onOverride={(sim) => setOverrideSim(sim)}
            />

            <OverrideSimulationDialog
                simulation={overrideSim}
                open={overrideSim !== null}
                onOpenChange={(open) => !open && setOverrideSim(null)}
                onConfirm={handleOverrideConfirm}
                isPending={overrideMutation.isPending}
            />
        </>
    );
};

export default AiOversight;
