import { create } from "zustand";
import { persist }  from "zustand/middleware";

import type { JobPostingFormValues } from "../schemas/jobPosting";

interface JobDraftState {
    draft : Partial<JobPostingFormValues>;
    setDraft : (values : Partial<JobPostingFormValues>) => void;
    clearDraft : () => void;
}

export const useJobDraftStore = create<JobDraftState>()(
    persist(
        (set) => ({
            draft : {},
            setDraft: (values) => set((state) => ({ draft : { ...state.draft, ...values}})),
            clearDraft : () => set({ draft : {}}),
        }),
        { name : "gainday-job-draft" }
    )
) ;