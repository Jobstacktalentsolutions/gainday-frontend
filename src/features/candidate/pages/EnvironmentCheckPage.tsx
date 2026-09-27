import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sparkles, Maximize, Wifi, MonitorCheck, Check, X, Loader2 } from "lucide-react";
import { PublicNavbar } from "../components/PublicNavbar";
import { ActionButton } from "@/components/ui/ActionButton";
import { apiClient } from "@/lib/api/client";
import { useFullscreenCheck } from "../hooks/useFullscreenCheck";
import { useConnectionCheck } from "../hooks/useConnectionCheck";
import { useTabVisibilityGuard } from "../hooks/useTabVisibilityGuard";
import { useSimulationIntegrityStore } from "../hooks/useSimulationIntegrityStore";
import { useJobDetails } from "../hooks/useJobDetails";
import { useJobSimulation } from "../hooks/useJobSimulation";
import { useSimulationRunStore } from "../store/useSimulationRunStore";

type CheckStatus = "checking" | "ready" | "failed";

function StatusBadge({ status, readyLabel }: { status: CheckStatus; readyLabel: string }) {
    if (status === "checking") {
        return (
            <span className="flex items-center gap-1 text-[14px] text-neutral-400">
                <Loader2 className="size-4 animate-spin" /> Checking...
            </span>
        );
    }
    if (status === "failed") {
        return (
            <span className="flex items-center gap-1 text-[14px] text-error-500">
                <X className="size-4" /> Failed
            </span>
        );
    }
    return (
        <span className="flex items-center gap-1 text-[14px] text-primary-500">
            <Check className="size-4" /> {readyLabel}
        </span>
    );
}

export default function EnvironmentCheckPage() {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const recordViolation = useSimulationIntegrityStore((state) => state.recordViolation);
    const setSubmissionId = useSimulationRunStore((state) => state.setSubmissionId);

    const { job } = useJobDetails(jobId);
    const { data: simulation } = useJobSimulation(job);

    const fullscreenCheck = useFullscreenCheck();
    const connectionCheck = useConnectionCheck();
    const tabGuard = useTabVisibilityGuard({
        onViolation: (reason) => recordViolation(`pre-simulation-${reason}`),
    });

    const [fullscreenStatus, setFullscreenStatus] = useState<CheckStatus>("checking");
    const [isStarting, setIsStarting] = useState(false);
    const [startError, setStartError] = useState<string | null>(null);

    useEffect(() => {
        // Fullscreen was already requested on Pre-Simulation's click — this just
        // confirms it actually took, since the request itself can't happen here
        // (no user gesture on this screen).
        const isFullscreen = fullscreenCheck.verify();
        setFullscreenStatus(isFullscreen ? "ready" : "failed");

        connectionCheck.run();
        tabGuard.arm();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const allReady =
        fullscreenStatus === "ready" &&
        connectionCheck.status === "secure" &&
        tabGuard.status === "armed" &&
        Boolean(simulation);

    async function handleBegin() {
        if (!jobId || !simulation) return;
        setStartError(null);
        setIsStarting(true);
        try {
            const { data: submission } = await apiClient.post<{ id: string }>(
                `/submissions/job/${jobId}/start`,
                { simulationId: simulation.id },
            );
            setSubmissionId(submission.id);
            navigate(`/job-board/${jobId}/simulation`);
        } catch {
            setStartError("Couldn't start your simulation attempt. Please try again.");
            setIsStarting(false);
        }
    }

    return (
        <div className="min-h-screen w-full bg-neutral-50">
            <PublicNavbar />
            <main className="mx-auto flex w-full max-w-300 flex-col items-center gap-20 px-5 pb-20 pt-33.75 sm:pt-43.75">
                <div className="relative w-full max-w-246.5 overflow-hidden rounded-3xl bg-white p-10 shadow-[0px_4px_10px_rgba(16,24,40,0.05)]">
                    {/* Decorative gradient blobs */}
                    <div
                        aria-hidden="true"
                        className={`pointer-events-none block absolute z-50 -left-5 -top-64 h-105 w-95 rotate-[-49deg] rounded-full bg-linear-to-b  opacity-38 blur-3xl
                            bg-[linear-gradient(180deg,var(--color-primary-500)_40%,var(--color-secondary-500)_55%,var(--color-secondary-300)_65%,transparent_100%)]`}
                    />
                    <div
                        aria-hidden="true"
                        className={`pointer-events-none block absolute z-50 -right-5 -top-64 h-105 w-95 rotate-49 rounded-full bg-linear-to-b  opacity-38 blur-3xl
                            bg-[linear-gradient(180deg,var(--color-primary-500)_40%,var(--color-secondary-500)_55%,var(--color-secondary-300)_65%,transparent_100%)]`}
                    />

                    <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                        <Sparkles className="size-8 text-primary-500" strokeWidth={1.5} />
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-[16px] text-primary-500">System Verification</p>
                            <h1 className="text-[32px] leading-9.5 tracking-[-0.32px] text-primary-950">
                                Checking your simulation environment...
                            </h1>
                            <p className="text-[16px] text-neutral-400">
                                Please review the active diagnostics below to ensure a smooth simulation experience.
                            </p>
                        </div>

                        <div className="rounded-xl bg-linear-to-br from-secondary-500 to-primary-950 p-px w-full">
                            <div className="flex w-full flex-col gap-6 rounded-[11px] bg-neutral-50 p-6 text-left">
                                <div className="flex items-center gap-5">
                                    <Maximize className="size-5 shrink-0 text-primary-500" />
                                    <div className="flex flex-1 flex-col text-[16px]">
                                        <p className="text-neutral-950">Fullscreen Mode Permission</p>
                                        <p className="text-neutral-400">
                                            {fullscreenStatus === "failed"
                                                ? "Fullscreen was blocked — check your browser permissions and retry."
                                                : "Verified. Your browser supports mandatory focus-lock diagnostics."}
                                        </p>
                                    </div>
                                    <StatusBadge status={fullscreenStatus} readyLabel="READY" />
                                </div>
                                <div className="h-px w-full bg-neutral-200" />
                                <div className="flex items-center gap-5">
                                    <Wifi className="size-5 shrink-0 text-primary-500" />
                                    <div className="flex flex-1 flex-col text-[16px]">
                                        <p className="text-neutral-950">Secure Connection Established</p>
                                        <p className="text-neutral-400">
                                            {connectionCheck.status === "secure" && connectionCheck.latencyMs !== null
                                                ? `Latency: ${connectionCheck.latencyMs}ms. Highly stable connection to evaluation gateway.`
                                                : connectionCheck.status === "failed"
                                                    ? "Couldn't reach the evaluation gateway — check your connection and retry."
                                                    : "Measuring connection quality..."}
                                        </p>
                                    </div>
                                    <StatusBadge status={connectionCheck.status === "secure" ? "ready" : connectionCheck.status === "failed" ? "failed" : "checking"} readyLabel="SECURE" />
                                </div>
                                <div className="h-px w-full bg-neutral-200" />
                                <div className="flex items-center gap-5">
                                    <MonitorCheck className="size-5 shrink-0 text-primary-500" />
                                    <div className="flex flex-1 flex-col text-[16px]">
                                        <p className="text-neutral-950">Tab-switch monitoring armed</p>
                                        <p className="text-neutral-400">Leaving this tab during the simulation is tracked from this point on.</p>
                                    </div>
                                    <StatusBadge status={tabGuard.status === "armed" ? "ready" : "checking"} readyLabel="ARMED" />
                                </div>
                            </div>
                        </div>

                        <p className="text-[16px] text-neutral-400">
                            Once you hit Begin, tab switching is flagged and full-screen stays enforced. Close other tabs for peak
                            stability.
                        </p>

                        {startError && <p className="text-[14px] text-error-500">{startError}</p>}

                        <ActionButton variant="primary" size="lg" disabled={!allReady || isStarting} onClick={handleBegin}>
                            {isStarting ? "Starting..." : "Begin Simulation"}
                        </ActionButton>
                    </div>
                </div>
            </main>
        </div>
    );
}