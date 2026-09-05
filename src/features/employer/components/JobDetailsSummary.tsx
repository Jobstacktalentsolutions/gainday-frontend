import { Pencil } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { JobPostingFormValues } from "../schemas/jobPosting";

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

  const salaryRange =
    values.salaryFrom && values.salaryTo
      ? `£${values.salaryFrom.toLocaleString()} to £${values.salaryTo.toLocaleString()}`
      : values.salaryFrom
        ? `From £${values.salaryFrom.toLocaleString()}`
        : undefined;

  const locationDisplay = values.location
    ? values.isRemoteFriendly
      ? `${values.location} (Hybrid)`
      : values.location
    : undefined;

  const deadlineDisplay = values.deadline
    ? new Date(values.deadline).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : undefined;

  return (
    <div className="flex flex-col gap-6">
      {/* Title + edit button */}
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

      {/* Job description */}
      <p className="text-base text-neutral-700">{values.description}</p>

      {/* Grid: Category | Employment type, Location | Salary, Deadline */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <SummaryRow label="Category" value={values.skillCategory} />
        <SummaryRow label="Employment type" value={values.employmentType} />
        <SummaryRow label="Location" value={locationDisplay} />
        <SummaryRow label="Salary" value={salaryRange} />
        <SummaryRow label="Deadline" value={deadlineDisplay} />
      </div>

      {/* Skills tags */}
      {values.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-primary-50 px-2.5 py-1 text-sm text-primary-600"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* What this hire needs to solve */}
      {values.description && (
        <div className="flex flex-col gap-1">
          <p className="text-sm text-neutral-400">What this hire needs to solve</p>
          <p className="text-base text-neutral-700">{values.description}</p>
        </div>
      )}
    </div>
  );
};

export default JobDetailsSummary;