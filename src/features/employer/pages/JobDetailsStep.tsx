import { useNavigate, useOutletContext } from "react-router-dom";
import { Form, useFormContext } from "react-hook-form";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import TagInput from "@/components/ui/tagInput";
import JobPostingStepIndicator from "../components/JobPostingStepIndicator";
import type { JobPostingFormValues } from "../schemas/jobPosting";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormTextarea } from "@/components/form/FormTextarea";

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
                    <FormInput
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
                    <FormInput label="Company" readOnly {...register("company")} />

                    <FormInput
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
                            <input type="checkbox" {...register("isRemoteFriendly")} className="size-5 rounded-md border border-neutral-100" />
                            This role is remote-friendly
                        </label>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1 min-w-0">
                         <FormInput
                            label="Salary from"
                            type="number"
                            optional
                            startIcon={<span>£</span>}
                            {...register("salaryFrom")}
                         />
                        </div>
                        <div className="flex-1 min-w-0">
                         <FormInput
                            label="Salary to"
                            type="number"
                            optional
                            startIcon={<span>£</span>}
                            error={errors.salaryTo?.message}
                            {...register("salaryTo")}
                         />
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default JobDetailsStep;