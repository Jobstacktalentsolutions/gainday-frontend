import { useState, useMemo } from "react";
import { Briefcase, Zap, Users, ShieldCheck, ShieldAlert } from "lucide-react";
import { useAdminJobs, useRemoveJobPost } from "../hooks/useAdminJobs";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import LiveJobPostsPanel from "../components/LiveJobPostPanel";
import RemoveJobPostDialog from "../components/RemoveJobPostDialog";
import type { AdminJob } from "../types/job";
import { StatCardSkeleton, TableSkeleton } from "../components/skeletons";

const ContentModeration = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebouncedValue(searchTerm, 300);
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useAdminJobs({
        search: debouncedSearch,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        limit: 10,
    });

    const removeJobMutation = useRemoveJobPost();
    const [pendingRemoveJob, setPendingRemoveJob] = useState<AdminJob | null>(null);

    const handleConfirmRemove = (job: AdminJob) => {
        removeJobMutation.mutate(job.id, {
            onSuccess: () => setPendingRemoveJob(null),
        });
    };

    const allJobs = useMemo(
        () => data?.pages.flatMap((page) => page.items) ?? [],
        [data]
    );
    const totalCount = data?.pages[0]?.pagination.total ?? 0;

    const stats = useMemo(() => {
        if (!allJobs) return { total: totalCount, live: 0, totalApplicants: 0, withSimulation: 0, flagged: 0 };
        return {
            total: totalCount,
            live: allJobs.filter((j) => j.status === "live").length,
            totalApplicants: allJobs.reduce((acc, j) => acc + (j.applicantCount || 0), 0),
            withSimulation: allJobs.filter((j) => j.isSimulationReady).length,
            flagged: allJobs.filter((j) => (j.flaggedCount ?? 0) > 0).length,
        };
    }, [allJobs, totalCount]);

    return (
        <div className="flex w-full flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-neutral-900">Content Moderation</h1>
                <p className="text-sm text-neutral-500 mt-0.5">
                    Moderate employer job postings, review simulation readiness, and inspect applicant integrity
                </p>
            </div>

            {/* Metrics Overview Cards */}
            {isLoading && (
                <>
                    <StatCardSkeleton count={4} />
                    <TableSkeleton rows={5} columns={5} showHeader={false} />
                </>
            )}

            {!isLoading && !isError && (
                <>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4.5 shadow-xs">
                            <div className="flex items-center justify-between text-neutral-500">
                                <span className="text-xs font-semibold uppercase tracking-wider">
                                    Total Posts
                                </span>
                                <Briefcase className="size-4 text-primary-600" />
                            </div>
                            <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.total}</p>
                            <p className="text-[11px] text-neutral-500">{stats.live} currently loaded</p>
                        </div>

                        <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4.5 shadow-xs">
                            <div className="flex items-center justify-between text-neutral-500">
                                <span className="text-xs font-semibold uppercase tracking-wider">
                                    Total Applicants
                                </span>
                                <Users className="size-4 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.totalApplicants}</p>
                            <p className="text-[11px] text-neutral-500">Across loaded job simulations</p>
                        </div>

                        <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4.5 shadow-xs">
                            <div className="flex items-center justify-between text-neutral-500">
                                <span className="text-xs font-semibold uppercase tracking-wider">
                                    Simulations Ready
                                </span>
                                <Zap className="size-4 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.withSimulation}</p>
                            <p className="text-[11px] text-neutral-500">Verified task suites</p>
                        </div>

                        <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4.5 shadow-xs">
                            <div className="flex items-center justify-between text-neutral-500">
                                <span className="text-xs font-semibold uppercase tracking-wider">
                                    Flagged Jobs
                                </span>
                                {stats.flagged === 0 ? (
                                    <ShieldCheck className="size-4 text-emerald-600" />
                                ) : (
                                    <ShieldAlert className="size-4 text-error-600" />
                                )}
                            </div>
                            <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.flagged}</p>
                            <p className="text-[11px] text-neutral-500">
                                {stats.flagged === 0 ? "All candidate checks clear" : "Has flagged submissions"}
                            </p>
                        </div>
                    </div>

                    <LiveJobPostsPanel
                        jobs={allJobs}
                        totalCount={totalCount}
                        hasNextPage={hasNextPage}
                        isLoadingMore={isFetchingNextPage}
                        onLoadMore={() => fetchNextPage()}
                        onRemove={setPendingRemoveJob}
                        isRemoving={removeJobMutation.isPending}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                    />
                </>
            )}

            <RemoveJobPostDialog
                job={pendingRemoveJob}
                open={pendingRemoveJob !== null}
                onOpenChange={(open) => {
                    if (!open) setPendingRemoveJob(null);
                }}
                onConfirm={handleConfirmRemove}
                isPending={removeJobMutation.isPending}
            />
        </div>
    );
};

export default ContentModeration;