import { create } from "zustand";
import { persist }  from "zustand/middleware";

import type { JobPostingFormInput } from "../schemas/jobPosting";

interface JobDraftState {
    draft : Partial<JobPostingFormInput>;
    jobId : string | null;
    setDraft : (values : Partial<JobPostingFormInput>) => void;
    setJobId : (jobId : string | null) => void;
    clearDraft : () => void;
}

export const useJobDraftStore = create<JobDraftState>()(
    persist(
        (set) => ({
            draft : {},
            jobId : null,
            setDraft: (values) => set((state) => ({ draft : { ...state.draft, ...values}})),
            setJobId: (jobId) => set({ jobId }),
            clearDraft : () => set({ draft : {}, jobId : null }),
        }),
        { name : "gainday-job-draft" }
    )
) ;