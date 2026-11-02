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
            // The form emits its full value set on every change, so the draft is replaced, not merged.
            setDraft: (values) => set({ draft: values }),
            setJobId: (jobId) => set({ jobId }),
            clearDraft : () => set({ draft : {}, jobId : null }),
        }),
        { name : "gainday-job-draft" }
    )
) ;