import { useState, useMemo } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    RotateCw,
    Search,
    ShieldAlert,
    UserCheck,
    Clock,
} from "lucide-react";
import { AdminButton } from "@/components/ui/AdminButton";
import { formatShortDate } from "@/lib/formatDate";
import { cn } from "@/lib/utils";
import type { FailedScoringSubmission, ScoringFailureStatus } from "../types/aiOversight";

interface FailedScoringPanelProps {
    submissions: FailedScoringSubmission[];
    onRetry: (submission: FailedScoringSubmission) => void;
    retryingId: string | null;
}

type FilterTabId = "all" | "active" | "resolved";

const STATUS_CONFIG: Record<
    ScoringFailureStatus,
    { container: string; dot: string; label: string; icon: typeof CheckCircle2 }
> = {
    failed: {
        container: "bg-error-50 text-error-700 border-error-200",
        dot: "bg-error-500",
        label: "Failed",
        icon: ShieldAlert,
    },
    retrying: {
        container: "bg-warning-50 text-warning-700 border-warning-200",
        dot: "bg-warning-500",
        label: "Retrying",
        icon: RotateCw,
    },
    resolved: {
        container: "bg-success-50 text-success-700 border-success-200",
        dot: "bg-success-500",
        label: "Resolved",
        icon: CheckCircle2,
    },
};

const FailedScoringPanel = ({
    submissions,
    onRetry,
    retryingId,
}: FailedScoringPanelProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<FilterTabId>("all");

    const counts = useMemo(() => {
        const active = submissions.filter((s) => s.status !== "resolved").length;
        const resolved = submissions.filter((s) => s.status === "resolved").length;
        return {
            all: submissions.length,
            active,
            resolved,
        };
    }, [submissions]);

    const filteredSubmissions = useMemo(() => {
        return submissions.filter((sub) => {
            const matchesTab =
                activeTab === "all"
                    ? true
                    : activeTab === "active"
                    ? sub.status !== "resolved"
                    : sub.status === "resolved";

            const matchesSearch =
                !searchTerm.trim() ||
                sub.jobTitle.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                sub.candidateNumber.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                sub.failureReason.toLowerCase().includes(searchTerm.toLowerCase().trim());

            return matchesTab && matchesSearch;
        });
    }, [submissions, activeTab, searchTerm]);

    const filterTabs: { id: FilterTabId; label: string; count: number }[] = [
        { id: "all", label: "All Telemetry", count: counts.all },
        { id: "active", label: "Needs Attention", count: counts.active },
        { id: "resolved", label: "Resolved", count: counts.resolved },
    ];

    return (
        <section className="flex w-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs">
            {/* Header & Context */}
            <div className="flex flex-col gap-3 border-b border-neutral-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-neutral-900">
                            Candidate Scoring Telemetry & Fallbacks
                        </h2>
                        {counts.active > 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-error-50 border border-error-200 px-2 py-0.5 text-xs font-semibold text-error-700">
                                <span className="size-1.5 rounded-full bg-error-500 animate-pulse" />
                                {counts.active} action required
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-success-50 border border-success-200 px-2 py-0.5 text-xs font-semibold text-success-700">
                                <CheckCircle2 className="size-3 text-success-600" />
                                All healthy
                            </span>
                        )}
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">
                        Candidate simulation submissions that failed automated evaluation due to rate limits, timeouts, or model exceptions.
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
                        placeholder="Search by candidate #, job role, or error reason..."
                        className="h-9.5 w-full rounded-lg border border-neutral-200 bg-white pl-9.5 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                                activeTab === tab.id
                                    ? "bg-primary-600 text-white shadow-xs"
                                    : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                            )}
                        >
                            <span>{tab.label}</span>
                            <span
                                className={cn(
                                    "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                                    activeTab === tab.id
                                        ? "bg-white/25 text-white"
                                        : tab.id === "active" && tab.count > 0
                                        ? "bg-error-100 text-error-700"
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
            {filteredSubmissions.length === 0 && (
                <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                    <div className="flex size-10 items-center justify-center rounded-full bg-success-50 text-success-600 mb-3">
                        <CheckCircle2 className="size-5" />
                    </div>
                    <p className="text-sm font-semibold text-neutral-900">
                        {counts.active === 0 && activeTab === "active"
                            ? "Zero scoring failures pending"
                            : "No submissions found"}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500 max-w-sm">
                        {counts.active === 0 && activeTab === "active"
                            ? "All candidate submissions have evaluated without errors or timeouts."
                            : searchTerm
                            ? `No records match "${searchTerm}".`
                            : "No scoring submission records in this category."}
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

            {/* Submissions List */}
            {filteredSubmissions.length > 0 && (
                <div className="divide-y divide-neutral-100">
                    {filteredSubmissions.map((sub) => {
                        const style = STATUS_CONFIG[sub.status];
                        const isResolved = sub.status === "resolved";
                        const isRetrying = retryingId === sub.id || sub.status === "retrying";

                        return (
                            <div
                                key={sub.id}
                                className={cn(
                                    "flex flex-col gap-3 p-5 transition-colors sm:flex-row sm:items-center sm:justify-between",
                                    isResolved ? "bg-neutral-50/40 opacity-75" : "hover:bg-neutral-50/60"
                                )}
                            >
                                {/* Left Info */}
                                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-xs font-semibold text-neutral-800">
                                            <UserCheck className="size-3 text-neutral-500" />
                                            Candidate #{sub.candidateNumber}
                                        </span>

                                        <span className="text-neutral-300">·</span>

                                        <p className="text-sm font-semibold text-neutral-900 truncate">
                                            {sub.jobTitle}
                                        </p>

                                        <span className="inline-flex items-center rounded border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                                            Slot {sub.failedTaskIndex + 1}
                                        </span>

                                        <span
                                            className={cn(
                                                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                                                style.container
                                            )}
                                        >
                                            <span className={cn("size-1.5 rounded-full", style.dot)} />
                                            {style.label}
                                        </span>
                                    </div>

                                    {/* Reason box */}
                                    <div className="flex items-start gap-2 rounded-lg bg-neutral-100/70 px-3 py-2 text-xs">
                                        <AlertTriangle className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                                        <span className="text-neutral-700 font-mono text-[11px]">
                                            {sub.failureReason}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                                        <Clock className="size-3" />
                                        <span>Logged: {formatShortDate(sub.occurredAt)}</span>
                                        <span>·</span>
                                        <span>Candidate ID: {sub.candidateId}</span>
                                    </div>
                                </div>

                                {/* Right Actions */}
                                <div className="flex shrink-0 items-center gap-2 sm:self-center">
                                    {!isResolved && (
                                        <AdminButton
                                            id={`retry-scoring-${sub.id}`}
                                            variant="primary"
                                            size="sm"
                                            disabled={isRetrying}
                                            onClick={() => onRetry(sub)}
                                            className="h-8 text-xs cursor-pointer"
                                        >
                                            {isRetrying ? (
                                                <span className="flex items-center gap-1.5">
                                                    <RotateCw className="size-3 animate-spin" />
                                                    <span>Retrying…</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5">
                                                    <RotateCw className="size-3" />
                                                    <span>Retry Scoring</span>
                                                </span>
                                            )}
                                        </AdminButton>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default FailedScoringPanel;
