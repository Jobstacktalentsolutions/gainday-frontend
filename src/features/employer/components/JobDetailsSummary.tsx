import { Pencil } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { JobPostingFormValues } from "../schemas/jobPosting";
import { ROLES } from "../constants/jobPostingOptions";


interface SummaryRowProps {
    label: string;
    value?: string;
}

const SummaryRow = ({ label, value }: SummaryRowProps) => (
    <div className="flex flex-col gap-1">
        <p className="text-sm text-neutral-400">{label}</p>
        <p className="text-base text-neutral-950">{value || "—"}</p>
    </div>
);

interface JobDetailsSummaryProps {
    onEdit: () => void;
}

const JobDetailsSummary = ({ onEdit }: JobDetailsSummaryProps) => {
    const { watch } = useFormContext<JobPostingFormValues>();
    const values = watch();

    const roleLabel =
        ROLES.find((role) => role.value === values.roleCategory)?.label ?? values.roleCategory;

    const salaryRange =
        values.salaryFrom && values.salaryTo
            ? `${values.salaryFrom} – ${values.salaryTo}`
            : values.salaryFrom
                ? `From ${values.salaryFrom}`
                : undefined;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <p className="text-sm font-bold uppercase tracking-wide text-neutral-900">
                    {values.title || "Untitled role"}
                </p>
                <button
                    type="button"
                    onClick={onEdit}
                    aria-label="Edit job details"
                    className="flex size-6 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                >
                    <Pencil className="size-4" aria-hidden="true" />
                </button>
            </div>

            <p className="text-base text-neutral-700">{values.simulationBrief}</p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <SummaryRow label="Role category" value={roleLabel} />
                <SummaryRow label="Skill level" value={values.skillLevel} />
                <SummaryRow label="Location" value={values.location} />
                <SummaryRow label="Employment type" value={values.employmentType} />
                <SummaryRow label="Salary range" value={salaryRange} />
                <SummaryRow label="Remote friendly" value={values.isRemoteFriendly ? "Yes" : "No"} />
                <SummaryRow label="AI use policy" value={values.aiUsePolicy} />
                <SummaryRow label="Deadline" value={values.deadline} />
            </div>
        </div>
    );
};

export default JobDetailsSummary;