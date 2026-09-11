import { Briefcase, Plus } from "lucide-react";
import { Link } from "react-router-dom";

// Shown when there are zero ACTIVE jobs at all (not to be confused with
// NoResultsState, which covers zero results for the current filters).
export function EmptyJobBoardState() {
  return (
    <div className="flex h-[414px] w-full flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-primary-300 bg-white py-[29px]">
      <span className="flex size-[60px] items-center justify-center rounded-lg bg-primary-50">
        <Briefcase className="size-6 text-primary-500" />
      </span>
      <div className="flex flex-col items-center gap-6">
        <p className="w-[344px] text-center text-[16px] text-neutral-700">
          No live roles yet. New assessments are posted by employers every week.
        </p>
        {/* TODO: point at the employer landing/signup flow once that route exists */}
        <Link
          to="/for-employers"
          className="flex h-[52px] items-center justify-center gap-2 rounded-lg bg-primary-500 py-1 pl-6 pr-1 text-[16px] text-neutral-50"
        >
          Hiring? Post a Job
          <span className="flex size-11 items-center justify-center rounded-lg bg-secondary-500">
            <Plus className="size-4 text-white" />
          </span>
        </Link>
      </div>
    </div>
  );
}