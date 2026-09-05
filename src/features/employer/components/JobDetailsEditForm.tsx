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

      {/* Skill category + Employment type */}
      <div className="grid grid-cols-2 gap-4">
        <JobFormInput
          label="Skill category"
          optional
          error={errors.skillCategory?.message}
          {...register("skillCategory")}
        />

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
            This role is remote-friendly
          </label>
        </div>
      </div>

      {/* Salary */}
      <div className="grid grid-cols-2 gap-4">
        <JobFormInput
          label="Salary from (£)"
          optional
          type="number"
          error={errors.salaryFrom?.message}
          {...register("salaryFrom")}
        />
        <JobFormInput
          label="Salary to (£)"
          optional
          type="number"
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

      {/* What this hire needs to solve */}
      <FormTextarea
        label="What this hire needs to solve"
        rows={4}
        error={errors.description?.message}
        {...register("description")}
      />
    </div>
  );
};

export default JobDetailsEditForm;