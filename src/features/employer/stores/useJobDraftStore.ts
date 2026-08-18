import { create } from "zustand";
import { persist }  from "zustand/middleware";

import type { JobPostingFormValues } from "../schemas/jobPosting";

interface JobDraftSate {
    draft : Partial<JobPostingFormValues>;
    setDraft : (values : Partial<JobPostingFormValues>) => void;
    clearDraft : () => void;
}