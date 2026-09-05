import { Check } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { JobFormInput } from "@/components/form/JobFormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormTextarea } from "@/components/form/FormTextarea";
import SkillsRemovableList from "./SkillsRemovableList";
import type { JobPostingFormValues } from "../schemas/jobPosting";
import {
  ROLES,
  SKILL_LEVELS,
  EMPLOYMENT_TYPES,
  AI_USE_POLICIES, // TODO: confirm real wording once shared
} from "../constants/jobPostingOptions"

interface JobDetailsEditFormProps {
  onDone: () => void;
}

const JobDetailsEditForm = ({ onDone }: JobDetailsEditFormProps) => {
  const {
    register,
    control,
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
        <FormSelect label="Role" placeholder="Select a role" error={errors.role?.message} {...register("role")}>
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

      <JobFormInput
        label="Skill category"
        optional
        error={errors.roleCategory?.message}
        {...register("roleCategory")}
      />

      <div className="grid grid-cols-2 gap-4">
        <JobFormInput label="Company" error={errors.company?.message} {...register("company")} />
        <JobFormInput label="Location" error={errors.location?.message} {...register("location")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
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

        <JobFormInput
          label="Deadline"
          optional
          type="date"
          error={errors.deadline?.message}
          {...register("deadline")}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" className="size-4 rounded" {...register("isRemoteFriendly")} />
        This role is remote-friendly
      </label>

      <div className="grid grid-cols-2 gap-4">
        <JobFormInput
          label="Salary from"
          optional
          type="number"
          startIcon={<span className="text-neutral-400">£</span>}
          error={errors.salaryFrom?.message}
          {...register("salaryFrom")}
        />
        <JobFormInput
          label="Salary to"
          optional
          type="number"
          startIcon={<span className="text-neutral-400">£</span>}
          error={errors.salaryTo?.message}
          {...register("salaryTo")}
        />
      </div>

      <FormTextarea
        label="What your company does"
        optional
        rows={3}
        error={errors.companyDescription?.message}
        {...register("companyDescription")}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-base font-medium text-neutral-800">Skills</label>
        <p className="text-sm text-neutral-400">
          These skills were used to generate the challenge — remove any that no longer apply.
        </p>
        <Controller
          control={control}
          name="skills"
          render={({ field }) => (
            <SkillsRemovableList value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <FormTextarea
        label="Job description"
        rows={4}
        error={errors.description?.message}
        {...register("description")}
      />

      <FormSelect
        label="AI use policy"
        optional
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
    </div>
  );
};

export default JobDetailsEditForm;