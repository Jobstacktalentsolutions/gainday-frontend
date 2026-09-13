import { AdminButton } from "@/components/ui/AdminButton";
import type { AdminJob } from "../types/job";

interface LiveJobPostsPanelProps {
  jobs: AdminJob[];
  onRemove: (job: AdminJob) => void;
  isRemoving: boolean;
}

const LiveJobPostsPanel = ({ jobs, onRemove, isRemoving }: LiveJobPostsPanelProps) => {
  const liveJobs = jobs.filter((job) => job.status === "live");

  return (
    <div className="flex w-full flex-col gap-3 rounded-[10px] border border-neutral-200 bg-white p-5">
      <p className="text-base font-semibold text-neutral-900">Live Job Posts</p>

      {liveJobs.length === 0 && (
        <p className="py-3 text-sm text-neutral-500">No live job posts right now.</p>
      )}

      {liveJobs.map((job) => (
        <div key={job.id} className="flex w-full items-center gap-4 py-3">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="truncate text-sm font-medium text-neutral-900">
              {job.title} — {job.company}
            </p>
            <p className="text-xs text-neutral-500">{job.applicantCount} applicants</p>
          </div>
          <AdminButton
            variant="destructive"
            size="sm"
            onClick={() => onRemove(job)}
            disabled={isRemoving}
          >
            Remove Post
          </AdminButton>
        </div>
      ))}
    </div>
  );
};

export default LiveJobPostsPanel;