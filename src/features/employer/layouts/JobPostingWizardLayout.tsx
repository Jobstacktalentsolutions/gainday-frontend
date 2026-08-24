import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobPostingSchema, type JobPostingFormInput } from "../schemas/jobPosting";
import { useJobDraftStore } from "../stores/useJobDraftStore";
import { JOB_POSTING_DEFAULT_VALUES } from "../mocks/jobPostingDefaults";



const JobPostingWizardLayout = () => {
    const navigate = useNavigate();
    const { draft, setDraft, clearDraft } = useJobDraftStore();

    const form = useForm<JobPostingFormInput>({
        resolver: zodResolver(jobPostingSchema),
        defaultValues: { ...JOB_POSTING_DEFAULT_VALUES, ...draft },
        mode: "onBlur",
    })

    //persist to localstorage as the form is being filled
    useEffect(() => {
        const subscription = form.watch((values) => {
            setDraft(values as Partial<JobPostingFormInput>);
        });
        return () => subscription.unsubscribe();

    }, [setDraft, form]);

    const handleSaveAndExit = () => {
        navigate("/employer/jobs");
    }

    const handleDiscardDraft = () => {
        clearDraft();
        form.reset(JOB_POSTING_DEFAULT_VALUES);
    }

    return (
        <FormProvider {...form}>
            <Outlet context={{ onSaveAndExit: handleSaveAndExit, onDiscardDraft: handleDiscardDraft }} />
        </FormProvider>
    );
}

export default JobPostingWizardLayout;