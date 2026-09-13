import { Briefcase } from "lucide-react";
import AddItemButton from "@/components/ui/AddItemButton";

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
            <AddItemButton onClick={onPostJob}>
                Post your new job
            </AddItemButton>

        </div>
    );
}
export default JobsEmptyState;