import { useState, useMemo } from "react";
import { Briefcase, Zap, Users, ShieldCheck, ShieldAlert } from "lucide-react";
import { useAdminJobs, useRemoveJobPost } from "../hooks/useAdminJobs";
import LiveJobPostsPanel from "../components/LiveJobPostPanel";
import RemoveJobPostDialog from "../components/RemoveJobPostDialog";
import type { AdminJob } from "../types/job";

const ContentModeration = () => {
    const { data: jobs, isLoading, isError } = useAdminJobs();
    const removeJobMutation = useRemoveJobPost();
    const [pendingRemoveJob, setPendingRemoveJob] = useState<AdminJob | null>(null);

    const handleConfirmRemove = (job: AdminJob) => {
        removeJobMutation.mutate(job.id, {
            onSuccess: () => setPendingRemoveJob(null),
        });
    };

    const stats = useMemo(() => {
        if (!jobs) return { total: 0, live: 0, totalApplicants: 0, withSimulation: 0, flagged: 0 };
        return {
            total: jobs.length,
            live: jobs.filter((j) => j.status === "live").length,
            totalApplicants: jobs.reduce((acc, j) => acc + (j.applicantCount || 0), 0),
            withSimulation: jobs.filter((j) => j.isSimulationReady).length,
            flagged: jobs.filter((j) => (j.flaggedCount ?? 0) > 0).length,
        };
    }, [jobs]);

    return (
        <div className="flex w-full flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-neutral-900">Content Moderation</h1>
                <p className="text-sm text-neutral-500 mt-0.5">
                    Moderate employer job postings, review simulation readiness, and inspect applicant integrity
                </p>
            </div>

            {/* Metrics Overview Cards */}
            {!isLoading && !isError && jobs && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4.5 shadow-xs">
                        <div className="flex items-center justify-between text-neutral-500">
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Total Posts
                            </span>
                            <Briefcase className="size-4 text-primary-600" />
                        </div>
                        <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.total}</p>
                        <p className="text-[11px] text-neutral-500">{stats.live} currently live on board</p>
                    </div>

                    <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4.5 shadow-xs">
                        <div className="flex items-center justify-between text-neutral-500">
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Total Applicants
                            </span>
                            <Users className="size-4 text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.totalApplicants}</p>
                        <p className="text-[11px] text-neutral-500">Across all job simulations</p>
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
            )}

            {isLoading && (
                <div className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-12 text-center text-sm text-neutral-500">
                    Loading job postings and moderation queue...
                </div>
            )}

            {isError && (
                <div className="w-full rounded-2xl border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
                    Something went wrong loading content moderation data.
                </div>
            )}

            {!isLoading && !isError && (
                <LiveJobPostsPanel
                    jobs={jobs ?? []}
                    onRemove={setPendingRemoveJob}
                    isRemoving={removeJobMutation.isPending}
                />
            )}

            <RemoveJobPostDialog
                job={pendingRemoveJob}
                open={pendingRemoveJob !== null}
                onOpenChange={(open) => !open && setPendingRemoveJob(null)}
                onConfirm={handleConfirmRemove}
                isPending={removeJobMutation.isPending}
            />
        </div>
    );
};

export default ContentModeration;