import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { actionButtonVariants } from "@/components/ui/ActionButton";

const ApplicationsEmptyState = () => {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-primary-300 bg-white py-12 lg:py-20">
            <span className="flex size-12 items-center justify-center rounded-lg bg-primary-50">
                <Briefcase className="size-6 text-primary-500" aria-hidden="true" />
            </span>
            <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-xl text-black lg:text-2xl">No applications yet</p>
                <p className="max-w-72 text-base text-neutral-700">
                    Jobs you apply to will show up here so you can follow their progress.
                </p>
            </div>
            <Link to="/job-board" className={actionButtonVariants({ variant: "primary", size: "lg" })}>
                Browse jobs
            </Link>
        </div>
    );
};

export default ApplicationsEmptyState;