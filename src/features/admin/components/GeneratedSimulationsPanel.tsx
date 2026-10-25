import { useState, useMemo } from "react";
import { Search, Eye, SlidersHorizontal, RotateCw, Layers } from "lucide-react";
import { AdminButton } from "@/components/ui/AdminButton";
import { formatShortDate } from "@/lib/formatDate";
import { cn } from "@/lib/utils";
import type { GeneratedSimulation, SimulationStatus } from "../types/aiOversight";

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

const STATUS_BADGE_STYLES: Record<GeneratedSimulation["status"], string> = {
    live: "bg-success-50 text-success-700 border-success-200",
    draft: "bg-warning-50 text-warning-700 border-warning-200",
    archived: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

const STATUS_DOT_STYLES: Record<GeneratedSimulation["status"], string> = {
    live: "bg-success-500",
    draft: "bg-warning-500",
    archived: "bg-neutral-400",
};

type FilterStatus = "all" | SimulationStatus;

const GeneratedSimulationsPanel = ({
    simulations,
    onView,
    onRegenerate,
    onOverride,
    regeneratingId,
}: GeneratedSimulationsPanelProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

    const counts = useMemo(() => {
        return {
            all: simulations.length,
            live: simulations.filter((s) => s.status === "live").length,
            draft: simulations.filter((s) => s.status === "draft").length,
            archived: simulations.filter((s) => s.status === "archived").length,
        };
    }, [simulations]);

    const filteredSimulations = useMemo(() => {
        return simulations.filter((sim) => {
            const matchesStatus =
                statusFilter === "all" ? true : sim.status === statusFilter;
            const matchesSearch =
                !searchTerm.trim() ||
                sim.jobTitle.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                sim.jobId.toLowerCase().includes(searchTerm.toLowerCase().trim());
            return matchesStatus && matchesSearch;
        });
    }, [simulations, statusFilter, searchTerm]);

    const filterTabs: { id: FilterStatus; label: string; count: number }[] = [
        { id: "all", label: "All Simulations", count: counts.all },
        { id: "live", label: "Live", count: counts.live },
        { id: "draft", label: "Draft", count: counts.draft },
        { id: "archived", label: "Archived", count: counts.archived },
    ];

    return (
        <section className="flex w-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs">
            {/* Header & Context */}
            <div className="flex flex-col gap-3 border-b border-neutral-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-neutral-900">
                            Generated Simulations Catalog
                        </h2>
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-600">
                            {simulations.length} total
                        </span>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">
                        Multi-task simulations synthesized from employer job requirements. Override configurations or trigger re-generation.
                    </p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col gap-3 border-b border-neutral-100 bg-neutral-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search simulation by job title or Job ID..."
                        className="h-9.5 w-full rounded-lg border border-neutral-200 bg-white pl-9.5 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setStatusFilter(tab.id)}
                            className={cn(
                                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                                statusFilter === tab.id
                                    ? "bg-primary-600 text-white shadow-xs"
                                    : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                            )}
                        >
                            <span>{tab.label}</span>
                            <span
                                className={cn(
                                    "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                                    statusFilter === tab.id
                                        ? "bg-white/25 text-white"
                                        : "bg-neutral-100 text-neutral-600"
                                )}
                            >
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Empty States */}
            {filteredSimulations.length === 0 && (
                <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                    <div className="flex size-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 mb-3">
                        <Layers className="size-5" />
                    </div>
                    <p className="text-sm font-semibold text-neutral-800">
                        No simulations found
                    </p>
                    <p className="mt-1 text-xs text-neutral-500 max-w-sm">
                        {searchTerm
                            ? `No simulations match "${searchTerm}". Try resetting your search or filter.`
                            : "There are currently no simulations in this category."}
                    </p>
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                            className="mt-3 text-xs font-semibold text-primary-600 hover:text-primary-700 cursor-pointer"
                        >
                            Clear search filter
                        </button>
                    )}
                </div>
            )}

            {/* List / Table Items */}
            {filteredSimulations.length > 0 && (
                <div className="divide-y divide-neutral-100">
                    {/* Header Columns on md+ screens */}
                    <div className="hidden grid-cols-12 items-center bg-neutral-50/70 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 md:grid">
                        <span className="col-span-5">Job Role & ID</span>
                        <span className="col-span-2">Task Structure</span>
                        <span className="col-span-2">Status</span>
                        <span className="col-span-1">Generated</span>
                        <span className="col-span-2 text-right">Actions</span>
                    </div>

                    {filteredSimulations.map((sim) => (
                        <div
                            key={sim.id}
                            onClick={() => onView(sim)}
                            className="flex flex-col gap-3 p-4 transition-colors hover:bg-neutral-50/80 cursor-pointer md:grid md:grid-cols-12 md:items-center md:px-5 md:py-3.5"
                        >
                            {/* Role & ID */}
                            <div className="min-w-0 md:col-span-5">
                                <p className="truncate text-sm font-medium text-neutral-900">
                                    {sim.jobTitle}
                                </p>
                                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
                                    <span>ID: {sim.jobId}</span>
                                </div>
                            </div>

                            {/* Task Structure */}
                            <div className="flex items-center gap-2 md:col-span-2">
                                <span className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-xs font-medium text-neutral-700">
                                    <Layers className="size-3 text-neutral-400" />
                                    {sim.taskCount} Tasks
                                </span>
                            </div>

                            {/* Status */}
                            <div className="flex items-center md:col-span-2">
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                                        STATUS_BADGE_STYLES[sim.status]
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "size-1.5 rounded-full",
                                            STATUS_DOT_STYLES[sim.status]
                                        )}
                                    />
                                    {STATUS_LABELS[sim.status]}
                                </span>
                            </div>

                            {/* Generated Date */}
                            <div className="text-xs text-neutral-500 md:col-span-1">
                                {formatShortDate(sim.generatedAt)}
                            </div>

                            {/* Actions */}
                            <div
                                className="flex shrink-0 items-center justify-end gap-2 md:col-span-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    type="button"
                                    onClick={() => onView(sim)}
                                    title="View simulation details"
                                    className="flex size-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
                                >
                                    <Eye className="size-3.5" />
                                </button>

                                <AdminButton
                                    id={`regenerate-sim-${sim.id}`}
                                    variant="outline"
                                    size="sm"
                                    disabled={regeneratingId === sim.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRegenerate(sim);
                                    }}
                                    className="h-8 text-xs cursor-pointer"
                                >
                                    {regeneratingId === sim.id ? (
                                        <span className="flex items-center gap-1">
                                            <RotateCw className="size-3 animate-spin text-primary-600" />
                                            <span>Running…</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            <RotateCw className="size-3" />
                                            <span>Regenerate</span>
                                        </span>
                                    )}
                                </AdminButton>

                                <AdminButton
                                    id={`override-sim-${sim.id}`}
                                    variant="primary"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onOverride(sim);
                                    }}
                                    className="h-8 text-xs cursor-pointer"
                                >
                                    <span className="flex items-center gap-1">
                                        <SlidersHorizontal className="size-3" />
                                        <span>Override</span>
                                    </span>
                                </AdminButton>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default GeneratedSimulationsPanel;
