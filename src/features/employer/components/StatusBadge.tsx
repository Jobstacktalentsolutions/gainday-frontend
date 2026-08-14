import { cn } from "@/lib/utils";
import type { JobStatus } from "../types/job";

const STATUS_STYLES : Record<JobStatus, { label : string; className : string} > = {
    draft : { label : "Draft", className : "bg-neutral-100 text-neutral-700"},
    under
}