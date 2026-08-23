import { useNavigate } from "react-router-dom"
import JobPostingStepIndicator from "../components/JobPostingStepIndicator";
import { ArrowLeft, ArrowRight, Plus, RefreshCw } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormTextarea } from "@/components/form/FormTextarea";
import TaskCard from "../components/TaskCard";
import type { JobPostingFormValues } from "../schemas/jobPosting";
import { nanoid } from "zod";

const SimulationBuilder = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-50 px-6 pb-10 pt-34.75">
            <div className="mx-auto flex w-full max-w-85.5 flex-col gap-10.75">
                <div className="flex flex-col gap-3">
                    <button type="button" onClick={() => navigate(-1)} aria-label="Back">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl text-black">Post a job</h1>
                        <p className="text-base text-neutral-700">
                            Gainday decomposes the role, maps it to measurable capabilities, generates a work
                            assessment and quality checks it. Nothing reaches the candidate until you approve it
                        </p>
                    </div>
                </div>
                <JobPostingStepIndicator currentStep="simulation-builder" />

                {/* Shell only — capability field array + challenge generation build pending */}
                <div className="flex min-h-100 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 bg-white text-center">
                    <p className="text-base text-neutral-700">Simulation Builder — coming soon</p>
                </div>

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
                        disabled
                        className="flex h-10 cursor-not-allowed items-center gap-2 rounded-lg bg-primary-500 py-1 pl-4 pr-1 text-base text-neutral-50 opacity-70"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SimulationBuilder;