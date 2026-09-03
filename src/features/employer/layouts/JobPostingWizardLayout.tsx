import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobPostingSchema, type JobPostingFormInput } from "../schemas/jobPosting";
import { useJobDraftStore } from "../stores/useJobDraftStore";
import { JOB_POSTING_DEFAULT_VALUES } from "../mocks/jobPostingDefaults";
import JobPostingStepIndicator from "../components/JobPostingStepIndicator";
import { useSaveJobDraft } from "../hooks/useSaveJobDraft";



const JobPostingWizardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { draft, jobId, setDraft, setJobId, clearDraft } = useJobDraftStore();
    const saveDraftMutation = useSaveJobDraft();
    const [isSavingExit, setIsSavingExit] = useState(false);

    const form = useForm<JobPostingFormInput>({
        resolver: zodResolver(jobPostingSchema),
        defaultValues: { ...JOB_POSTING_DEFAULT_VALUES, ...draft },
        mode: "onChange",
    })

    // Derive current step from the URL
    const currentStep = (() => {
        const path = location.pathname;
        if (path.includes("simulation-builder")) return "simulation-builder" as const;
        if (path.includes("review")) return "review" as const;
        return "details" as const;
    })();

    //persist to localstorage as the form is being filled
    useEffect(() => {
        const subscription = form.watch((values) => {
            setDraft(values as Partial<JobPostingFormInput>);
        });
        return () => subscription.unsubscribe();

    }, [setDraft, form]);

    const handleSaveAndExit = async () => {
        setIsSavingExit(true);
        try {
            const values = form.getValues();
            const saved = await saveDraftMutation.mutateAsync({ ...values, id: jobId ?? undefined });
            setJobId(saved.id);
            navigate("/employer/jobs");
        } finally {
            setIsSavingExit(false);
        }
    }

    const handleDiscardDraft = () => {
        clearDraft();
        form.reset(JOB_POSTING_DEFAULT_VALUES);
    }

    return (
        <FormProvider {...form}>
            <div className="min-h-screen bg-neutral-50 px-4 pb-10 pt-33.5 lg:px-10">
                {/* Desktop: card container with sidebar + content */}
                <div className="mx-auto flex w-full max-w-280 flex-col lg:flex-row lg:gap-0 lg:rounded-3xl lg:bg-white/80 lg:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] lg:backdrop-blur-sm">

                    {/* Sidebar — vertical stepper */}
                    <aside className="hidden shrink-0 lg:flex lg:w-60 lg:flex-col lg:gap-6 lg:rounded-l-3xl lg:bg-neutral-50/60 lg:px-8 lg:py-10">
                        <JobPostingStepIndicator currentStep={currentStep} />
                    </aside>

                    {/* Mobile — horizontal stepper */}
                    <div className="px-2 pb-12 lg:hidden">
                        <JobPostingStepIndicator currentStep={currentStep} orientation="horizontal" />
                    </div>

                    {/* Main content area */}
                    <div className="flex min-w-0 flex-1 flex-col lg:px-10 lg:py-10">
                        <Outlet context={{
                            onSaveAndExit: handleSaveAndExit,
                            onDiscardDraft: handleDiscardDraft,
                            isSavingExit,
                            jobId,
                            setJobId,
                        }} />
                    </div>
                </div>
            </div>
        </FormProvider>
    );
}

export default JobPostingWizardLayout;