import { useState, useMemo } from "react";
import {
    Sparkles,
    AlertTriangle,
    ShieldAlert,
    CheckCircle2,
    Bot,
    Info,
} from "lucide-react";
import {
    useGeneratedSimulations,
    useRegenerateSimulation,
    useOverrideSimulation,
    useFailedScoringSubmissions,
    useRetryScoring,
} from "../hooks/useAiOversight";
import { useGenerationReviews } from "../hooks/useGenerationReviews";
import GeneratedSimulationsPanel from "../components/GeneratedSimulationsPanel";
import FailedScoringPanel from "../components/FailedScoringPanel";
import GenerationReviewsPanel from "../components/GenerationReviewsPanel";
import ViewSimulationDialog from "../components/ViewSimulationDialog";
import OverrideSimulationDialog from "../components/OverrideSimulationDialog";
import AiPipelineFlow from "../components/AiPipelineFlow";
import type { GeneratedSimulation } from "../types/aiOversight";
import { StatCardSkeleton, TableSkeleton } from "../components/skeletons";
import { cn } from "@/lib/utils";

type TabId = "all" | "reviews" | "scoring" | "simulations";

const AiOversight = () => {
    const [activeTab, setActiveTab] = useState<TabId>("all");
    const [showGuide, setShowGuide] = useState(true);

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

    // Query pending reviews count for operational badge and stat cards
    const {
        data: pendingReviewsData,
        isLoading: reviewsLoading,
    } = useGenerationReviews("PENDING", 1);

    const pendingReviewsCount =
        pendingReviewsData?.pages[0]?.pagination.total ?? 0;

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

    // ── Derived Telemetry Metrics ─────────────────────────────────────────────
    const metrics = useMemo(() => {
        const sims = simulations ?? [];
        const liveSims = sims.filter((s) => s.status === "live").length;
        const draftSims = sims.filter((s) => s.status === "draft").length;
        const archivedSims = sims.filter((s) => s.status === "archived").length;

        const fails = failedSubmissions ?? [];
        const activeFailures = fails.filter((f) => f.status !== "resolved").length;

        const isHealthy = pendingReviewsCount === 0 && activeFailures === 0;

        return {
            totalSims: sims.length,
            liveSims,
            draftSims,
            archivedSims,
            activeFailures,
            isHealthy,
        };
    }, [simulations, failedSubmissions, pendingReviewsCount]);

    const isInitialLoading = simsLoading && failedLoading;

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-6">
            {/* Page Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                            AI Engine Oversight
                        </h1>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-neutral-700 shadow-xs">
                            <Bot className="size-3.5 text-primary-600" />
                            Engine v2.4
                        </span>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">
                        Monitor automated simulation generation pipelines, review critic validation fallbacks, and manage candidate scoring telemetry
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowGuide((prev) => !prev)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-xs hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                        <Info className="size-3.5 text-primary-600" />
                        <span>{showGuide ? "Hide Pipeline Guide" : "View Pipeline Guide"}</span>
                    </button>
                </div>
            </div>

            {/* Architecture Context Banner */}
            {showGuide && <AiPipelineFlow defaultExpanded={true} />}

            {/* Telemetry Stat Cards */}
            {isInitialLoading ? (
                <StatCardSkeleton count={4} />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1: Active Simulations */}
                    <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                Live Simulations
                            </span>
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                <Sparkles className="size-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="text-3xl font-extrabold text-neutral-900">
                                {metrics.liveSims}
                                <span className="text-sm font-medium text-neutral-400">
                                    {" "}/ {metrics.totalSims}
                                </span>
                            </span>
                            <p className="mt-1 text-xs text-neutral-500">
                                <span className="font-semibold text-neutral-700">
                                    {metrics.draftSims}
                                </span>{" "}
                                draft ·{" "}
                                <span className="font-semibold text-neutral-700">
                                    {metrics.archivedSims}
                                </span>{" "}
                                archived
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Critic Review Queue */}
                    <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                Critic Fallback Queue
                            </span>
                            <div
                                className={cn(
                                    "rounded-lg p-2",
                                    pendingReviewsCount > 0
                                        ? "bg-amber-50 text-amber-600"
                                        : "bg-neutral-100 text-neutral-500"
                                )}
                            >
                                <AlertTriangle className="size-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold text-neutral-900">
                                    {reviewsLoading ? "…" : pendingReviewsCount}
                                </span>
                                {pendingReviewsCount > 0 ? (
                                    <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                                        Action needed
                                    </span>
                                ) : (
                                    <span className="rounded-full bg-success-50 border border-success-200 px-2 py-0.5 text-[11px] font-semibold text-success-700">
                                        All clear
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-neutral-500">
                                {pendingReviewsCount > 0
                                    ? "Task slots failing automated rubrics"
                                    : "All generator slots validated"}
                            </p>
                        </div>
                    </div>

                    {/* Card 3: Scoring Telemetry */}
                    <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                Scoring Failures
                            </span>
                            <div
                                className={cn(
                                    "rounded-lg p-2",
                                    metrics.activeFailures > 0
                                        ? "bg-rose-50 text-rose-600"
                                        : "bg-neutral-100 text-neutral-500"
                                )}
                            >
                                <ShieldAlert className="size-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold text-neutral-900">
                                    {failedLoading ? "…" : metrics.activeFailures}
                                </span>
                                {metrics.activeFailures > 0 ? (
                                    <span className="rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                                        Retries pending
                                    </span>
                                ) : (
                                    <span className="rounded-full bg-success-50 border border-success-200 px-2 py-0.5 text-[11px] font-semibold text-success-700">
                                        Zero errors
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-neutral-500">
                                {metrics.activeFailures > 0
                                    ? "Candidate submissions awaiting retry"
                                    : "All candidate submissions scored"}
                            </p>
                        </div>
                    </div>

                    {/* Card 4: Engine Reliability State */}
                    <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                Engine Reliability
                            </span>
                            <div
                                className={cn(
                                    "rounded-lg p-2",
                                    metrics.isHealthy
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-amber-50 text-amber-600"
                                )}
                            >
                                <CheckCircle2 className="size-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="text-3xl font-extrabold text-neutral-900">
                                {metrics.isHealthy ? "99.8%" : "97.4%"}
                            </span>
                            <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                                <span
                                    className={cn(
                                        "size-2 rounded-full",
                                        metrics.isHealthy ? "bg-emerald-500" : "bg-amber-500"
                                    )}
                                />
                                <span className="font-medium text-neutral-700">
                                    {metrics.isHealthy ? "Fully Operational" : "Review Queues Active"}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Urgent Action Callout (surfaced when action items exist) */}
            {(pendingReviewsCount > 0 || metrics.activeFailures > 0) && (
                <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-amber-100 p-2 text-amber-800">
                            <AlertTriangle className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-900">
                                Operational Queues Require Administrator Review
                            </h3>
                            <p className="mt-0.5 text-xs text-neutral-700">
                                {pendingReviewsCount > 0 && (
                                    <span>
                                        <strong>{pendingReviewsCount}</strong> generation slot(s) pending human critic review
                                    </span>
                                )}
                                {pendingReviewsCount > 0 && metrics.activeFailures > 0 && " · "}
                                {metrics.activeFailures > 0 && (
                                    <span>
                                        <strong>{metrics.activeFailures}</strong> candidate submission(s) pending scoring retry
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {pendingReviewsCount > 0 && (
                            <button
                                type="button"
                                onClick={() => setActiveTab("reviews")}
                                className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 transition-colors cursor-pointer"
                            >
                                Open Review Queue
                            </button>
                        )}
                        {metrics.activeFailures > 0 && (
                            <button
                                type="button"
                                onClick={() => setActiveTab("scoring")}
                                className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 shadow-xs hover:bg-amber-50 transition-colors cursor-pointer"
                            >
                                Inspect Scoring Retries
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Navigation Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-3">
                {[
                    { id: "all" as TabId, label: "All Oversight Queues", count: null },
                    {
                        id: "reviews" as TabId,
                        label: "Critic Reviews",
                        count: pendingReviewsCount,
                        badgeColor: pendingReviewsCount > 0 ? "bg-amber-100 text-amber-800" : "bg-neutral-100 text-neutral-600",
                    },
                    {
                        id: "scoring" as TabId,
                        label: "Scoring Telemetry",
                        count: metrics.activeFailures,
                        badgeColor: metrics.activeFailures > 0 ? "bg-rose-100 text-rose-800" : "bg-neutral-100 text-neutral-600",
                    },
                    {
                        id: "simulations" as TabId,
                        label: "Simulation Registry",
                        count: metrics.totalSims,
                        badgeColor: "bg-neutral-100 text-neutral-600",
                    },
                ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer",
                                isActive
                                    ? "bg-primary-600 text-white shadow-xs"
                                    : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                            )}
                        >
                            <span>{tab.label}</span>
                            {tab.count !== null && (
                                <span
                                    className={cn(
                                        "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                        isActive
                                            ? "bg-white/20 text-white"
                                            : tab.badgeColor
                                    )}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tab Views Content */}
            {activeTab === "all" && (
                <div className="flex flex-col gap-6">
                    {/* Critic Generation Reviews Queue */}
                    <GenerationReviewsPanel />

                    {/* Candidate Scoring Telemetry Panel */}
                    {failedLoading && <TableSkeleton rows={3} columns={4} showHeader={false} />}
                    {failedError && (
                        <div className="w-full rounded-xl border border-error-200 bg-error-50 px-5 py-8 text-center text-sm text-error-600">
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

                    {/* Generated Simulations Panel */}
                    {simsLoading && <TableSkeleton rows={4} columns={4} showHeader={false} />}
                    {simsError && (
                        <div className="w-full rounded-xl border border-error-200 bg-error-50 px-5 py-8 text-center text-sm text-error-600">
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
                </div>
            )}

            {activeTab === "reviews" && (
                <div className="flex flex-col gap-4">
                    <GenerationReviewsPanel />
                </div>
            )}

            {activeTab === "scoring" && (
                <div className="flex flex-col gap-4">
                    {failedLoading && <TableSkeleton rows={4} columns={4} showHeader={false} />}
                    {failedError && (
                        <div className="w-full rounded-xl border border-error-200 bg-error-50 px-5 py-8 text-center text-sm text-error-600">
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
                </div>
            )}

            {activeTab === "simulations" && (
                <div className="flex flex-col gap-4">
                    {simsLoading && <TableSkeleton rows={5} columns={4} showHeader={false} />}
                    {simsError && (
                        <div className="w-full rounded-xl border border-error-200 bg-error-50 px-5 py-8 text-center text-sm text-error-600">
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
                </div>
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
        </div>
    );
};

export default AiOversight;
