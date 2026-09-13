import { Check } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { JobFormInput } from "@/components/form/JobFormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormTextarea } from "@/components/form/FormTextarea";
import TagInput from "@/components/ui/tagInput";
import type { JobPostingFormValues } from "../schemas/jobPosting";
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

      {/* Employment type */}
      <div className="flex flex-col gap-1.5">
        <FormSelect
          label="Employment type"
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
          Is this role remote?
        </label>
      </div>

      {/* Salary */}
      <div className="grid grid-cols-2 gap-4">
        <JobFormInput
          label="Salary from (£)"
          formatCommas
          optional
          startIcon={<span>£</span>}
          error={errors.salaryFrom?.message}
          {...register("salaryFrom")}
        />
        <JobFormInput
          label="Salary to (£)"
          formatCommas
          optional
          startIcon={<span>£</span>}
          error={errors.salaryTo?.message}
          {...register("salaryTo")}
        />
      </div>

      {/* Location + Deadline */}
      <div className="grid grid-cols-2 gap-4">
        <JobFormInput
          label="Location"
          error={errors.location?.message}
          {...register("location")}
        />
        <JobFormInput
          label="Deadline"
          optional
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

      {/* Job description */}
      <FormTextarea
        label="Job description"
        rows={4}
        error={errors.description?.message}
        {...register("description")}
      />

      {/* Business problem */}
      <FormTextarea
        label="What specific business problem should this hire help solve?"
        optional
        rows={3}
        error={errors.businessProblem?.message}
        {...register("businessProblem")}
      />
    </div>
  );
};

export default JobDetailsEditForm;