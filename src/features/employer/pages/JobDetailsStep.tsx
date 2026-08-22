import { useNavigate, useOutletContext } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import TagInput from "@/components/ui/tagInput";
import JobPostingStepIndicator from "../components/JobPostingStepIndicator";
import type { JobPostingFormValues } from "../schemas/jobPosting";

import { FormSelect } from "@/components/form/FormSelect";
import { FormTextarea } from "@/components/form/FormTextarea";
import { JobFormInput } from "@/components/form/JobFormInput";

const ROLE_CATEGORIES = ["Operations", "Engineering", "Finance", "Sales", "Compliance"];
const SKILL_LEVELS = ["Entry level", "Mid level", "Senior level"];
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract"];
const COMPLETION_TIMES = ["15 minutes", "20 minutes", "30 minutes", "45 minutes"];
const AI_USE_POLICIES = ["Not permitted", "Permitted with disclosure", "Fully permitted"];

const JobDetailsStep = () => {
    const navigate = useNavigate();
    const { onSaveAndExit } = useOutletContext<{ onSaveAndExit: () => void }>();
    const {
        register,
        watch,
        setValue,
        trigger,
        formState: { errors },
    } = useFormContext<JobPostingFormValues>();

    const skills = watch("skills") ?? [];
    const simulationBrief = watch("simulationBrief") ?? "";

    const handleContinue = async () => {
        const isValid = await trigger();
        if (!isValid) navigate("/employer/jobs/new/simulation-builder");
    };

    return (
        <div className="min-h-screen bg-neutral-50 px-6 pb-10 pt-34.75">
            <div className="mx-auto flex w-full max-w-85.5 flex-col gap-10.75">
                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        aria-label="Back"
                    >
                        <ArrowLeft size={6} />
                    </button>
                    <div>
                        <h1 className="text-2xl text-black">Post a job</h1>
                        <p className="text-base text-neutral-700">
                            Gainday decomposes the role, maps it to measurable capabilities, generates a work
                            assessment and quality checks it. Nothing reaches the candidate until you approve it
                        </p>
                    </div>
                </div>
                <JobPostingStepIndicator currentStep="details" />

                <div className="flex flex-col gap-4">
                    <JobFormInput
                        label="Job title"
                        required
                        placeholder="2.g Customer Operations Business Manager"
                        error={errors.title?.message}
                        {...register("title")}
                    />

                    <FormSelect
                        label="Role category"
                        required
                        placeholder="Select a category"
                        error={errors.roleCategory?.message}
                        {...register("roleCategory")}
                    >
                        {ROLE_CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </FormSelect>

                    <FormSelect
                        label="Skill level"
                        required
                        placeholder="Select a skill level"
                        error={errors.skillLevel?.message}
                        {...register("skillLevel")}
                    >
                        {SKILL_LEVELS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </FormSelect>

                    <JobFormInput label="Company" readOnly {...register("company")} />

                    <JobFormInput
                        label="Location"
                        required
                        error={errors.location?.message}
                    />

                    <div className="flex flex-col gap-2">
                        <FormSelect
                            label="Employment type"
                            required
                            placeholder="Select a type"
                            error={errors.employmentType?.message}
                            {...register("employmentType")}
                        >
                            {EMPLOYMENT_TYPES.map((t) => (
                                <option key={t} value={t}> {t}</option>
                            ))}
                        </FormSelect>
                        <label className="flex items-center gap-1 text-xs text-neutral-400">
                            <input type="checkbox" {...register("isRemoteFriendly")} className="size-5 rounded-md border bg-neutral-50 border-neutral-100" />
                            This role is remote-friendly
                        </label>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1 min-w-0">
                            <JobFormInput
                                label="Salary from"
                                type="number"
                                optional
                                startIcon={<span>£</span>}
                                {...register("salaryFrom")}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <JobFormInput
                                label="Salary to"
                                type="number"
                                optional
                                startIcon={<span>£</span>}
                                error={errors.salaryTo?.message}
                                {...register("salaryTo")}
                            />
                        </div>
                    </div>

                    <FormTextarea
                        label="What your company does"
                        optional
                        placeholder="Enter a description..."
                        rows={3}
                        {...register("companyDescription")}
                    />
                    <FormTextarea
                        label="Role description"
                        optional
                        placeholder="What the person does day by day, who they work with..."
                        rows={3}
                        {...register("roleDescription")}
                    />
                    <div className="flex flex-1 flex-col gap-1.5">
                        <label className="text-base font-medium text-neutral-800">Skills that matter, comma separated</label>
                        <TagInput
                            value={skills}
                            onChange={(tags) => setValue("skills", tags, { shouldValidate: true })}
                            placeholder="Type a skill and enter"
                        />
                    </div>

                    {/*AI Simulation callout*/}
                    <div className="flex w-full flex-col gap-2.5 rounded-xl bg-primary-50 p-3">
                        <span className="flex w-fit items-center gap-1 rounded-md border border-primary-500  p-2 text-[10px] text-primary-500">
                            <Sparkles className="size-3" aria-hidden="true" />
                            POWERS YOUR AI SIMULATION
                        </span>
                        <p className="text-base text-neutral-950">What does this hire need to solve?</p>
                        <p className="text-base text-neutral-400">
                            This next field is the most important one. Gainday turns it into a real work
                            simulation assessment, so write it the way you would brief a new starter on their
                            first morning.
                        </p>
                        <FormTextarea
                            label="Simulation brief"
                            hideLabel
                            placeholder="Enter a description..."
                            rows={8}
                            error={errors.simulationBrief?.message}
                            className="bg-neutral-50"
                            {...register("simulationBrief")}
                        />
                        <p className="text-sm text-neutral-700">
                            {simulationBrief.length}/350 characters. 40 minimum
                        </p>
                    </div>

                    <FormSelect
                        label="Estimated completion time"
                        required
                        placeholder="Select a duration"
                        error={errors.estimatedCompletionTime?.message}
                        {...register("estimatedCompletionTime")}
                    >
                        {COMPLETION_TIMES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}

                    </FormSelect>
                    <FormSelect
                        label="AI use policy"
                        required
                        placeholder="Select a policy"
                        error={errors.aiUsePolicy?.message}
                        {...register("aiUsePolicy")}
                    >
                        {AI_USE_POLICIES.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </FormSelect>
                </div>
                <div className="flex items-center justify-between">
                    <button type="button" onClick={onSaveAndExit} className="h-10 cursor-pointer rounded-lg border border-neutral-200 px-4 text-base text-neutral-600">
                        Save and exit
                    </button>
                    <button
                        type="button"
                        onClick={handleContinue}
                        className="flex cursor-pointer h-10 items-center gap-2 rounded-lg bg-primary-500 py-1 pl-4 pr-1 text-base text-neutral-50"
                    >
                        Continue
                        <span className="flex size-8 items-center justify-center rounded-lg bg-secondary-500">
                            <ArrowRight className="size-4 text-white" aria-hidden="true" />
                        </span>
                    </button>
                </div>
            </div>

        </div>
    )
}

export default JobDetailsStep;