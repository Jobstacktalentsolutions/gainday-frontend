import { useNavigate } from "react-router-dom"
import { ArrowRight, Plus, RefreshCw } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormTextarea } from "@/components/form/FormTextarea";
import TaskCard from "../components/TaskCard";
import type { JobPostingFormValues } from "../schemas/jobPosting";


const SimulationBuilder = () => {
    const navigate = useNavigate();

    const {
        register,
        control,
        trigger,
        formState: { errors },
    } = useFormContext<JobPostingFormValues>()

    const { fields, append, remove } = useFieldArray({
        control,
        name: "tasks",
    });

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
        console.log("AI call would happen here");
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
                        capabilities={field.capabilities}
                        scores={field.scores}
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
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="h-10 rounded-lg border border-neutral-200 px-4 text-base text-neutral-600"
                >
                    Back
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
    )
}

export default SimulationBuilder;