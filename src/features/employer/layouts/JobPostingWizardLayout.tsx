import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobPostingSchema, type JobPostingFormInput, type JobPostingFormValues } from "../schemas/jobPosting";
import { useJobDraftStore } from "../stores/useJobDraftStore";

const DEFAULT_VALUES : Partial<JobPostingFormInput> = {
    company : "Gett", // pull from authenticated employer's profile
    isRemoteFriendly : false,
    skills : []
};

const JobPostingWizardLayout = () => {
    const navigate = useNavigate();
    const { draft, setDraft, clearDraft} = useJobDraftStore();

    const form = useForm<JobPostingFormInput> ({
        resolver : zodResolver(jobPostingSchema),
        defaultValues : { ...DEFAULT_VALUES, ...draft},
        mode : "onBlur",
    })

    //persist to localstorage as the form is being filled
    useEffect (() => {
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
        form.reset(DEFAULT_VALUES);
    }

    return (
        <FormProvider { ...form}>
            <Outlet context = {{onSaveAndExit : handleSaveAndExit, onDiscardDraft : handleDiscardDraft }} />
        </FormProvider>
    );
}

export default JobPostingWizardLayout ;