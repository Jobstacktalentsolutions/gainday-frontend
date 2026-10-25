import { useState, useEffect, useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useFormContext, Controller } from "react-hook-form";
import { Sparkles, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import TagInput from "@/components/ui/tagInput";
import { jobDetailsSchema, type JobPostingFormValues } from "../schemas/jobPosting";
import TaskGenerationModal from "../components/TaskGenerationModal";
import JobDescriptionPasteInput from "../components/JobDescriptionPasteInput";
import TaskPromptEditor from "../components/TaskPromptEditor";
import type { ParsedJobDetails } from "../hooks/useParseJobDescription";
import { useSaveJobDetails } from "../hooks/useSaveJobDraft";
import { useTriggerGeneration } from "../hooks/useTriggerGeneration";
import type { GenerationNavState } from "../hooks/useGenerationProgress";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { useJobDraftStore } from "../stores/useJobDraftStore";

import { FormSelect } from "@/components/form/FormSelect";
import { FormTextarea } from "@/components/form/FormTextarea";
import { JobFormInput } from "@/components/form/JobFormInput";
import { StepSecondaryButton, StepContinueButton } from "@/components/ui/StepNavigationButtons";

// The roles the engine has modules for. A role is a top-level domain; a sub-role is written after it
// (e.g. "Finance > Private Equity") when the posting or the employer names one.
const ROLES = [
    { value: "Finance", label: "Finance" },
    { value: "Sales", label: "Sales" },
    { value: "Customer Service", label: "Customer Service" },
];

// Jobs saved before the form used category labels store these values. They show under their label.
const LEGACY_ROLE_LABELS: Record<string, string> = { FINANCE: "Finance", SALES: "Sales" };
const normaliseRole = (value: string | undefined | null): string =>
    value ? (LEGACY_ROLE_LABELS[value] ?? value) : "";
// Sentinel for the "Add Yours" option — never itself saved as the role value; picking it just
// switches the field into free-text mode. The AI generation pipeline accepts any role text (a
// purpose-built role module if one's registered for it, otherwise a generic fallback — see
// backend's RoleRegistry.resolve), so a custom role here is a first-class value, not a workaround.
const CUSTOM_ROLE_VALUE = "__custom__";
const SKILL_LEVELS = ["Entry level", "Mid level", "Senior level"];
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract"];

interface JobPostingOutletContext {
    onSaveAndExit: () => void;
    jobId: string | null;
    setJobId: (jobId: string | null) => void;
}

const JobDetailsStep = () => {
    const navigate = useNavigate();
    const { onSaveAndExit, jobId, setJobId } = useOutletContext<JobPostingOutletContext>();
    const [isGenerating, setIsGenerating] = useState(false);
    // True only while the current description value is exactly what the parser
    // produced. Cleared the instant the person edits the field by hand.
    const [isDescriptionAiGenerated, setIsDescriptionAiGenerated] = useState(false);
    const saveDetailsMutation = useSaveJobDetails();
    const triggerGeneration = useTriggerGeneration();
    const { data: profile } = useProfile();

    const {
        register,
        control,
        watch,
        setValue,
        reset,
        trigger,
        formState: { errors },
    } = useFormContext<JobPostingFormValues>();

    const formValues = watch();
    const skills = formValues.skills ?? [];
    const hasExistingContent = Boolean(
        formValues.title?.trim() ||
        formValues.role?.trim() ||
        formValues.description?.trim() ||
        (formValues.skills && formValues.skills.length > 0) ||
        formValues.companyDescription?.trim() ||
        formValues.businessProblem?.trim() ||
        formValues.location?.trim() ||
        formValues.skillCategory?.trim() ||
        formValues.salaryFrom ||
        formValues.salaryTo ||
        formValues.deadline
    );

    // The role as the select shows it. A role that is not a preset (an inferred "Finance > Private
    // Equity", or one saved earlier) appears as its own option, so the employer can keep it or pick another.
    const roleValue = normaliseRole(formValues.role);
    const isPresetRole = useMemo(() => ROLES.some((r) => r.value === roleValue), [roleValue]);
    const [customRoleActive, setCustomRoleActive] = useState(false);
    // Free-text mode only when the employer picks "Add yours..." (see the select below).
    const isCustomRole = customRoleActive;

    const isStepValid = useMemo(() => {
        return jobDetailsSchema.safeParse(formValues).success;
    }, [formValues]);

    // Synchronize company profile name into form state when loaded
    useEffect(() => {
        if (profile?.companyName && !formValues.company) {
            setValue("company", profile.companyName, { shouldValidate: true });
        }
    }, [profile?.companyName, formValues.company, setValue]);

    // Applies parsed fields onto the form, overwriting only the fields the parser
    // actually returned a value for. The generated description replaces the field
    // directly (no raw-JD passthrough) and is flagged as AI-generated until edited.
    const handleParsed = (parsed: ParsedJobDetails) => {
        const fieldSetters: Array<[keyof ParsedJobDetails, keyof JobPostingFormValues]> = [
            ["title", "title"],
            ["role", "role"],
            ["skillLevel", "skillLevel"],
            ["skillCategory", "skillCategory"],
            ["location", "location"],
            ["employmentType", "employmentType"],
            ["deadline", "deadline"],
            ["isRemoteFriendly", "isRemoteFriendly"],
            ["salaryFrom", "salaryFrom"],
            ["salaryTo", "salaryTo"],
            ["companyDescription", "companyDescription"],
            ["businessProblem", "businessProblem"],
        ];

        fieldSetters.forEach(([parsedKey, formKey]) => {
            const value = parsed[parsedKey];
            if (value !== undefined) {
                setValue(formKey, value as never, { shouldValidate: true });
            }
        });

        if (parsed.skills && parsed.skills.length > 0) {
            setValue("skills", parsed.skills, { shouldValidate: true });
        }

        if (parsed.formattedDescription) {
            setValue("description", parsed.formattedDescription, { shouldValidate: true });
            setIsDescriptionAiGenerated(true);
        }
    };

    const handleContinue = async () => {
        const isValid = await trigger([
            "title",
            "role",
            "skillLevel",
            "skillCategory",
            "company",
            "location",
            "employmentType",
            "deadline",
            "isRemoteFriendly",
            "salaryFrom",
            "salaryTo",
            "companyDescription",
            "skills",
            "description",
            "businessProblem",
        ]);

        if (!isValid) return;

        setIsGenerating(true);

        try {
            const values = watch();
            const saved = await saveDetailsMutation.mutateAsync({ ...values, id: jobId ?? undefined });
            setJobId(saved.id);

            // Queues the real generation pipeline (async on the backend); SimulationBuilder streams
            // its progress and shows the generating UI once we navigate there.
            await triggerGeneration.mutateAsync(saved.id);
            const navState: GenerationNavState = { generationQueued: true };
            navigate("/employer/jobs/new/simulation-builder", { state: navState });
        } catch {
            toast.error("Couldn't start generation — try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCancelGeneration = () => {
        setIsGenerating(false);
    };

    const handleClearAll = () => {
        useJobDraftStore.getState().clearDraft();
        setJobId(null);
        reset({
            title: "",
            role: "",
            skillLevel: "",
            skillCategory: "",
            company: profile?.companyName ?? "",
            location: "",
            employmentType: "",
            deadline: "",
            isRemoteFriendly: false,
            salaryFrom: undefined,
            salaryTo: undefined,
            companyDescription: "",
            skills: [],
            description: "",
            businessProblem: "",
            tasks: [],
        });
        setIsDescriptionAiGenerated(false);
        setCustomRoleActive(false);
        toast.success("All fields cleared");
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

            {/* Paste-and-parse entry point — first thing on the page */}
            <JobDescriptionPasteInput onParsed={handleParsed} hasExistingContent={hasExistingContent} />

            {/* Form fields — two-column grid on desktop */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Job title — full width with Clear action */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                        <label
                            htmlFor="job-title-input"
                            className="flex items-center gap-1 text-base font-medium text-neutral-800 select-none"
                        >
                            Job title
                            <span aria-hidden="true" className="text-error-500">
                                *
                            </span>
                        </label>
                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-red-600 transition-colors"
                        >
                            <RotateCcw className="size-3.5" />
                            <span>Clear</span>
                        </button>
                    </div>
                    <JobFormInput
                        id="job-title-input"
                        label="Job title"
                        hideLabel
                        placeholder="e.g Customer Operations Business Manager"
                        error={errors.title?.message}
                        {...register("title")}
                    />
                </div>

                {/* Role + Skill level — side by side */}
                {isCustomRole ? (
                    <div className="flex flex-col gap-1.5">
                        <JobFormInput
                            label="Role"
                            placeholder="e.g. Customer Support"
                            error={errors.role?.message}
                            {...register("role")}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setCustomRoleActive(false);
                                setValue("role", "", { shouldValidate: true });
                            }}
                            className="self-start text-xs text-primary-500 hover:underline"
                        >
                            Choose from the list instead
                        </button>
                    </div>
                ) : (
                    <FormSelect
                        label="Role"
                        placeholder="Select a role"
                        error={errors.role?.message}
                        value={roleValue}
                        onChange={(e) => {
                            const { value } = e.target;
                            if (value === CUSTOM_ROLE_VALUE) {
                                setCustomRoleActive(true);
                                setValue("role", "", { shouldValidate: false });
                            } else {
                                setValue("role", value, { shouldValidate: true });
                            }
                        }}
                    >
                        {roleValue !== "" && !isPresetRole ? <option value={roleValue}>{roleValue}</option> : null}
                        {ROLES.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                        <option value={CUSTOM_ROLE_VALUE}>Add yours...</option>
                    </FormSelect>
                )}

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

                {/* Skill category — optional, full width */}
                <div className="lg:col-span-2">
                    <JobFormInput
                        label="Skill category"
                        optional
                        placeholder="e.g Credit Risk"
                        error={errors.skillCategory?.message}
                        {...register("skillCategory")}
                    />
                </div>

                {/* Company (read-only, from the employer's profile) + Location — side by side */}
                <JobFormInput
                    label="Company"
                    readOnly
                    value={formValues.company ?? profile?.companyName ?? ""}
                    {...register("company")}
                />
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
                    type="date"
                    error={errors.deadline?.message}
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
                    error={errors.salaryFrom?.message}
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


                {/* Skills — full width */}
                <div className="flex flex-col gap-1.5 lg:col-span-2">
                    <label className="text-base font-medium text-neutral-800">Skills that matter, comma separated</label>
                    <TagInput
                        value={skills}
                        onChange={(tags) => setValue("skills", tags, { shouldValidate: true })}
                        placeholder="Type a skill and enter"
                    />
                </div>

                {/* Job description — the full, candidate-facing writeup. Populated (as markdown) by
                    pasting-and-parsing an existing description above, or written by hand. */}
                <div className="flex flex-col gap-1.5 lg:col-span-2">
                    <div className="flex items-center justify-between gap-2">
                        <label className="text-base font-medium text-neutral-800">Job description</label>
                        {isDescriptionAiGenerated && (
                            <span className="flex w-fit items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700">
                                <Sparkles className="size-3" aria-hidden="true" />
                                AI-generated — review before continuing
                            </span>
                        )}
                    </div>
                    <Controller
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <TaskPromptEditor
                                value={field.value}
                                onChange={(markdown) => {
                                    field.onChange(markdown);
                                    // Any manual edit means this is no longer purely the AI's
                                    // text, so the "review" hint disappears.
                                    setIsDescriptionAiGenerated(false);
                                }}
                                error={errors.description?.message}
                                placeholder="Write or paste the full job description here..."
                                contentClassName="max-h-64 overflow-y-auto lg:max-h-96"
                            />
                        )}
                    />
                </div>

                {/* What does this hire need to solve field — full width */}
                <div className="lg:col-span-2">
                    <FormTextarea
                        label="What does this hire need to solve?"
                        optional
                        placeholder="e.g Reduce onboarding drop-off by improving our KYC follow-up flow"
                        rows={3}
                        error={errors.businessProblem?.message}
                        {...register("businessProblem")}
                    />
                </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
                <StepSecondaryButton onClick={onSaveAndExit}>
                    Save and exit
                </StepSecondaryButton>
                <StepContinueButton disabled={!isStepValid} onClick={handleContinue}>
                    Continue
                </StepContinueButton>
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
