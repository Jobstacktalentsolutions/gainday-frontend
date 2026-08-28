import { Briefcase, Plus } from "lucide-react";

interface JobsEmptyStateProps {
    onPostJob: () => void;
}

const JobsEmptyState = ({ onPostJob }: JobsEmptyStateProps) => {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-primary-300 bg-white py-12 lg:py-20">
            <span className="flex size-12 items-center justify-center rounded-lg bg-primary-50 ">
                <Briefcase className="size-6 text-primary-500" aria-hidden="true" />
            </span>
            <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-xl text-black lg:text-2xl">No jobs posted yet</p>
                <p className="w-60 text-base text-neutral-700">
                    Post your first job free and get a ranked shortlist of proven talent.
                </p>
            </div>
            <button
                type="button"
                onClick={ onPostJob }
                className ="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary-500 py-1 pl-4 pr-1 text-base text-neutral-50"
            >
                <span>Post your new job</span>
                <span className ="flex size-8 items-center rounded-lg bg-secondary-500">
                    <Plus className ="size-4 text-white" aria-hidden="true" />
                </span>
            </button>

        </div>
    );
}
export default JobsEmptyState;