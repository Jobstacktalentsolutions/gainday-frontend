import { Check } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { JobFormInput } from "@/components/form/JobFormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormTextarea } from "@/components/form/FormTextarea";
import TagInput from "@/components/ui/tagInput";
import TaskPromptEditor from "./TaskPromptEditor";
import { cn } from "@/lib/utils";
import { BUSINESS_PROBLEM_MAX, JOB_DESCRIPTION_MAX, type JobPostingFormValues } from "../schemas/jobPosting";
import { EMPLOYMENT_TYPES } from "../constants/jobPostingOptions";

interface JobDetailsEditFormProps {
  onDone: () => void;
}

const JobDetailsEditForm = ({ onDone }: JobDetailsEditFormProps) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<JobPostingFormValues>();
  const title = watch("title");
  const description = watch("description");

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold uppercase tracking-wide text-neutral-900">
          {title || "Untitled role"}
        </p>
        <button
          type="button"
          onClick={onDone}
          className="flex h-8 items-center gap-1.5 rounded-md border border-neutral-200 px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          <Check className="size-3.5" aria-hidden="true" />
          Done
        </button>
      </div>

      {/* Skill category + Employment type */}
      <div className="grid grid-cols-2 gap-4">
        <JobFormInput
          label="Skill category"
          error={errors.skillCategory?.message}
          {...register("skillCategory")}
        />

        <div className="flex flex-col gap-1.5">
          <FormSelect
            label="Employment type"
            required
            placeholder="Select a type"
            error={errors.employmentType?.message}
            {...register("employmentType")}
          >
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </FormSelect>

          <label className="flex items-center gap-2 text-sm text-neutral-500">
            <input
              type="checkbox"
              className="size-3.5 rounded"
              {...register("isRemoteFriendly")}
            />
            This role is remote-friendly
          </label>
        </div>
      </div>

      {/* Salary */}
      <div className="grid grid-cols-2 gap-4">
        <JobFormInput
          label="Salary from (£)"
          type="number"
          error={errors.salaryFrom?.message}
          {...register("salaryFrom")}
        />
        <JobFormInput
          label="Salary to (£)"
          type="number"
          error={errors.salaryTo?.message}
          {...register("salaryTo")}
        />
      </div>

      {/* Location + Deadline */}
      <div className="grid grid-cols-2 gap-4">
        <JobFormInput
          label="Location"
          required
          error={errors.location?.message}
          {...register("location")}
        />
        <JobFormInput
          label="Deadline"
          type="date"
          error={errors.deadline?.message}
          {...register("deadline")}
        />
      </div>

      {/* Skills */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">Skills</label>
        <Controller
          control={control}
          name="skills"
          render={({ field }) => (
            <TagInput
              value={field.value}
              onChange={field.onChange}
              placeholder="Type a skill and press Enter"
            />
          )}
        />
      </div>

      {/* What this hire needs to solve */}
      <FormTextarea
        label="What this hire needs to solve"
        rows={3}
        hint={`Up to ${BUSINESS_PROBLEM_MAX} characters.`}
        placeholder="e.g. We need someone to own our enterprise onboarding process..."
        error={errors.businessProblem?.message}
        {...register("businessProblem")}
      />

      {/* Job description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">Job description</label>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TaskPromptEditor
              value={field.value}
              onChange={field.onChange}
              error={errors.description?.message}
              placeholder="Write or paste the full job description here..."
              contentClassName="max-h-64 overflow-y-auto"
            />
          )}
        />
        <p className={cn("text-right text-sm tabular-nums", description.length > JOB_DESCRIPTION_MAX ? "text-error-500" : "text-neutral-400")}>
          {description.length.toLocaleString("en-GB")} / {JOB_DESCRIPTION_MAX.toLocaleString("en-GB")} characters
        </p>
      </div>
    </div>
  );
};

export default JobDetailsEditForm;
