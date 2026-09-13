import { useState } from "react";
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
        })
    };


    return (
        <>
            <h1 className="text-2xl font-semibold text-neutral-900">Content Moderation</h1>

            {isLoading && (
                <div className="w-full rounded-[10px] border border-neutral-200 bg-white px-5 py-10 text-center text-sm text-neutral-500">
                    Loading...
                </div>
            )}

            {isError && (
                <div className="w-full rounded-[10px] border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
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

            {/*
            For anti-cheat later on.
            */}

            <RemoveJobPostDialog
                job={pendingRemoveJob}
                open={pendingRemoveJob !== null}
                onOpenChange={(open) => !open && setPendingRemoveJob(null)}
                onConfirm={handleConfirmRemove}
                isPending={removeJobMutation.isPending}
            />


        </>
    );
}

export default ContentModeration;