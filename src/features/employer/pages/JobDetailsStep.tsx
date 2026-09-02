import { useState, useRef, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import { ArrowRight, Sparkles } from "lucide-react";
import TagInput from "@/components/ui/tagInput";
import type { JobPostingFormValues } from "../schemas/jobPosting";
import TaskGenerationModal from "../components/TaskGenerationModal";

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
    const [isGenerating, setIsGenerating] = useState(false);
    const abortTimerRef = useRef<NodeJS.Timeout | null>(null);

    const {
        register,
        watch,
        setValue,
        trigger,
        formState: { errors },
    } = useFormContext<JobPostingFormValues>();

    const skills = watch("skills") ?? [];
    const simulationBrief = watch("simulationBrief") ?? "";

    useEffect(() => {
        return () => {
            if (abortTimerRef.current) {
                clearTimeout(abortTimerRef.current);
            }
        };
    }, []);

    const handleContinue = async () => {
        const isValid = await trigger([
            "title",
            "roleCategory",
            "skillLevel",
            "company",
            "location",
            "employmentType",
            "deadline",
            "isRemoteFriendly",
            "salaryFrom",
            "salaryTo",
            "companyDescription",
            "roleDescription",
            "skills",
            "simulationBrief",
            "estimatedCompletionTime",
            "aiUsePolicy",
        ]);

        if (!isValid) return;

        setIsGenerating(true);

        abortTimerRef.current = setTimeout(() => {
            setIsGenerating(false);
            navigate("/employer/jobs/new/simulation-builder");
        }, 2800);
    };

    const handleCancelGeneration = () => {
        if (abortTimerRef.current) {
            clearTimeout(abortTimerRef.current);
            abortTimerRef.current = null;
        }
        setIsGenerating(false);
    };

    return (
        <div className="flex flex-col gap-12">
            {/* Header — centered */}
            <div className="flex flex-col lg:items-center gap-2 text-left lg:text-center">
                <h1 className="text-3xl  font-bold text-black lg:text-4xl">Post a job</h1>
                <p className="max-w-lg text-base text-neutral-500">
                    Gainday decomposes the role, maps it to measurable capabilities, generates a work
                    assessment and quality checks it. Nothing reaches the candidate until you approve it
                </p>
            </div>

            {/* Form fields — two-column grid on desktop */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Job title — full width */}
                <div className="lg:col-span-2">
                    <JobFormInput
                        label="Job title"
                        placeholder="e.g Customer Operations Business Manager"
                        error={errors.title?.message}
                        {...register("title")}
                    />
                </div>

                {/* Role category + Skill level — side by side */}
                <FormSelect
                    label="Role category"
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
                    placeholder="Select a skill level"
                    error={errors.skillLevel?.message}
                    {...register("skillLevel")}
                >
                    {SKILL_LEVELS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </FormSelect>

                {/* Company + Location — side by side */}
                <JobFormInput label="Company" readOnly {...register("company")} />
                <JobFormInput
                    label="Location"
                    placeholder="London, UK"
                    error={errors.location?.message}
                    {...register("location")}
                />

                {/* Employment type + Deadline — side by side */}
                <FormSelect
                    label="Employment type"
                    placeholder="Select a type"
                    error={errors.employmentType?.message}
                    {...register("employmentType")}
                >
                    {EMPLOYMENT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </FormSelect>

                <JobFormInput
                    label="Deadline"
                    optional
                    placeholder=""
                    {...register("deadline")}
                />

                {/* Remote-friendly checkbox — full width */}
                <div className="lg:col-span-2">
                    <label className="flex items-center gap-1 text-xs text-neutral-400">
                        <input type="checkbox" {...register("isRemoteFriendly")} className="size-5 rounded-md border bg-neutral-50 border-neutral-100" />
                        This role is remote-friendly
                    </label>
                </div>

                {/* Salary from + Salary to — side by side */}
                <JobFormInput
                    label="Salary from (£)"
                    type="number"
                    optional
                    startIcon={<span>£</span>}
                    {...register("salaryFrom")}
                />
                <JobFormInput
                    label="Salary to (£)"
                    type="number"
                    optional
                    startIcon={<span>£</span>}
                    error={errors.salaryTo?.message}
                    {...register("salaryTo")}
                />

                {/* What your company does — full width */}
                <div className="lg:col-span-2">
                    <FormTextarea
                        label="What your company does"
                        optional
                        placeholder="Enter a description..."
                        rows={3}
                        {...register("companyDescription")}
                    />
                </div>

                {/* Role description — full width (kept but not in screenshot) */}
                <div className="lg:col-span-2">
                    <FormTextarea
                        label="Role description"
                        optional
                        placeholder="What the person does day by day, who they work with..."
                        rows={3}
                        {...register("roleDescription")}
                    />
                </div>

                {/* Skills — full width */}
                <div className="flex flex-col gap-1.5 lg:col-span-2">
                    <label className="text-base font-medium text-neutral-800">Skills that matter, comma separated</label>
                    <TagInput
                        value={skills}
                        onChange={(tags) => setValue("skills", tags, { shouldValidate: true })}
                        placeholder="Type a skill and enter"
                    />
                </div>

                {/* AI Simulation callout — full width */}
                <div className="flex w-full flex-col gap-2.5 rounded-xl bg-primary-50 p-3 lg:col-span-2">
                    <span className="flex w-fit items-center gap-1 rounded-md border border-primary-500 p-2 text-[10px] text-primary-500">
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

                {/* Estimated completion time + AI use policy — side by side */}
                <FormSelect
                    label="Estimated completion time"
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
                    placeholder="Select a policy"
                    error={errors.aiUsePolicy?.message}
                    {...register("aiUsePolicy")}
                >
                    {AI_USE_POLICIES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </FormSelect>
            </div>

            {/* Navigation buttons */}
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

            {/* Task Generation Loading Modal */}
            <TaskGenerationModal
                open={isGenerating}
                onCancel={handleCancelGeneration}
            />
        </div>
    )
}

export default JobDetailsStep;