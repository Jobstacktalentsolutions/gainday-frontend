import { Inbox } from "@/components/ui/icons";
import AddItemButton from "@/components/ui/AddItemButton";

interface JobsEmptyStateProps {
    onPostJob: () => void;
}

const JobsEmptyState = ({ onPostJob }: JobsEmptyStateProps) => {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-primary-300 bg-white py-12 lg:py-20">
            <span className="icon-gradient-frame size-16">
                <span className="text-primary-500"><Inbox className="size-8" aria-hidden="true" /></span>
            </span>
            <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-xl text-black lg:text-2xl">No jobs posted yet</p>
                <p className="w-80 max-w-full text-base text-neutral-700">
                    Post your first job for free and review a ranked shortlist of qualified candidates.
                </p>
            </div>
            <AddItemButton onClick={onPostJob}>
                Post your new job
            </AddItemButton>

        </div>
    );
}
export default JobsEmptyState;
