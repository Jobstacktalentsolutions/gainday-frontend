import { create } from "zustand";
import { persist }  from "zustand/middleware";

import type { JobPostingFormInput } from "../schemas/jobPosting";

interface JobDraftState {
    draft : Partial<JobPostingFormInput>;
    setDraft : (values : Partial<JobPostingFormInput>) => void;
    clearDraft : () => void;
}

export const useJobDraftStore = create<JobDraftState>()(
    persist(
        (set) => ({
            draft : {},
            // The form emits its full value set on every change, so the draft is replaced, not merged.
            setDraft: (values) => set({ draft: values }),
            clearDraft : () => set({ draft : {} }),
        }),
        { name : "gainday-job-draft", partialize: (state) => ({ draft: state.draft }) }
    )
) ;