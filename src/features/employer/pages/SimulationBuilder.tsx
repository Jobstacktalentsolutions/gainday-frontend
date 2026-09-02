import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormTextarea } from "@/components/form/FormTextarea";
import { StepSecondaryButton, StepContinueButton } from "@/components/ui/StepNavigationButtons";
import TaskCard from "../components/TaskCard";
import { simulationBuilderSchema, type JobPostingFormValues } from "../schemas/jobPosting";
import TaskGenerationModal from "../components/TaskGenerationModal";
import { MOCK_SCENARIO_INTRO, MOCK_TASKS } from "../mocks/jobPostingDefaults";

const SimulationBuilder = () => {
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const abortTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const {
        register,
        control,
        setValue,
        trigger,
        watch,
        formState: { errors },
    } = useFormContext<JobPostingFormValues>();

    const formValues = watch();
    const isStepValid = simulationBuilderSchema.safeParse(formValues).success;

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "tasks",
    });

    useEffect(() => {
        return () => {
            if (abortTimerRef.current) {
                clearTimeout(abortTimerRef.current);
            }
        };
    }, []);

    const handleAddTask = () => {
        append({
            id: crypto.randomUUID(),
            type: "written",
            title: "",
            taskPrompt: "",
            scenario: "",
            capabilities: [],
            scores: [],
        });
    };

    const handleRegenerate = () => {
        setIsGenerating(true);
        abortTimerRef.current = setTimeout(() => {
            setValue("scenarioIntro", MOCK_SCENARIO_INTRO, { shouldValidate: true });
            replace(MOCK_TASKS);
            setIsGenerating(false);
        }, 2800);
    };

    const handleCancelGeneration = () => {
        if (abortTimerRef.current) {
            clearTimeout(abortTimerRef.current);
            abortTimerRef.current = null;
        }
        setIsGenerating(false);
    };

    const handleContinue = async () => {
        const isValid = await trigger(["scenarioIntro", "tasks"]);
        if (isValid) navigate("/employer/jobs/new/review");
    };

    return (
        <div className="flex flex-col gap-12">
            {/* Header — centered */}
            <div className="flex flex-col lg:items-center gap-2 text-left lg:text-center">
                <h1 className="text-3xl font-bold text-black lg:text-4xl">Challenge generation</h1>
                <p className="max-w-lg text-base text-neutral-500">
                    A realistic work simulation assessment built from the capabilities you approved.
                    Estimated completion time: 20 minutes.
                </p>
            </div>

            {/* Challenge content */}
            <div className="flex w-full flex-col gap-10 rounded-3xl border border-dashed shadow-sm bg-white/70 px-3 py-10 text-center">
                <div className="flex flex-col gap-3 text-left">
                    <p className="text-sm text-primary-500">CHALLENGE GENERATION</p>
                    <p className="text-base text-neutral-950">
                        A realistic work simulation assessment built from the capabilities you approved.
                        Estimated completion time: 20 minutes.
                    </p>
                    <button
                        type="button"
                        onClick={handleRegenerate}
                        className="flex h-10 self-start items-center justify-center gap-2 rounded-xl border border-neutral-300 px-6 py-2 text-base text-neutral-950"
                    >
                        Regenerate
                        <RefreshCw className="size-4 " aria-hidden="true" />
                    </button>
                </div>

                <FormTextarea
                    label="Scenario intro the candidate reads first"
                    rows={10}
                    error={errors.scenarioIntro?.message}
                    {...register("scenarioIntro")}
                />
                {fields.map((field, index) => (
                    <TaskCard
                        key={field.id}
                        index={index}
                        type={field.type}
                        onRemove={() => remove(index)}
                    />
                ))}

                <button
                    type="button"
                    onClick={handleAddTask}
                    className="flex h-10 w-full cursor-pointer hover:bg-[#f7f6f6] items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 px-4 text-base text-neutral-950"
                >
                    <Plus className="size-4" aria-hidden="true" />
                    Add Task
                </button>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
                <StepSecondaryButton onClick={() => navigate(-1)}>
                    Back
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

export default SimulationBuilder;