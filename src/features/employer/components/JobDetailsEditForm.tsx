import { Check } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { JobFormInput } from "@/components/form/JobFormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormTextarea } from "@/components/form/FormTextarea";
import SkillsRemovableList from "./SkillsRemovableList";
import type { JobPostingFormValues } from "../schemas/jobPosting";

import { ROLES, SKILL_LEVELS, EMPLOYMENT_TYPES, AI_USE_POLICIES } from "../constants/jobPostingOptions";

interface JobDetailsEditFormProps {
  onDone: () => void;
}

const JobDetailsEditForm = ({ onDone }: JobDetailsEditFormProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<JobPostingFormValues>();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold uppercase tracking-wide text-neutral-900">
          Job details
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

      <JobFormInput label="Job title" error={errors.title?.message} {...register("title")} />

      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          label="Role category"
          placeholder="Select a category"
          error={errors.roleCategory?.message}
          {...register("roleCategory")}
        >
          {ROLES.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </FormSelect>

        <FormSelect
          label="Skill level"
          placeholder="Select a level"
          error={errors.skillLevel?.message}
          {...register("skillLevel")}
        >
          {SKILL_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </FormSelect>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <JobFormInput label="Location" error={errors.location?.message} {...register("location")} />

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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <JobFormInput
          label="Salary from"
          type="number"
          error={errors.salaryFrom?.message}
          {...register("salaryFrom")}
        />
        <JobFormInput
          label="Salary to"
          type="number"
          error={errors.salaryTo?.message}
          {...register("salaryTo")}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" className="size-4 rounded" {...register("isRemoteFriendly")} />
        Remote friendly
      </label>

      <FormSelect
        label="AI use policy"
        placeholder="Select a policy"
        error={errors.aiUsePolicy?.message}
        {...register("aiUsePolicy")}
      >
        {AI_USE_POLICIES.map((policy) => (
          <option key={policy} value={policy}>
            {policy}
          </option>
        ))}
      </FormSelect>

      <JobFormInput label="Deadline" type="date" error={errors.deadline?.message} {...register("deadline")} />
    </div>
  );
};

export default JobDetailsEditForm;