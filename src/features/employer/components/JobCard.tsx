import { Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Skeleton from "@/components/ui/skeleton";
import StatusBadge from "./StatusBadge";
import JobMetaRow from "./JobMetaRow";
import type { Job } from "../types/job";

interface  JobCardProps {
    job : Job;
    onShareLink : (job : Job) => void;
    onViewSubmissions : (job : Job) => void;
}

const formatPostedDate = (postedAt : string | null) => {
    if (!postedAt) return "Not published yet";

    return `Posted ${ new Date(postedAt).toLocaleDateString("en-GB",  {
        day : "numeric",
        month : "short",
        year : "numeric",
    })}`
    
}

const JobCard = ({ job, onShareLink, onViewSubmissions}: JobCardProps) => {
    
    const hasSubmissions = job.submissionsCount > 0;
    return (
        <article className = "flex w-full flex-col gap-3 rounded-3xl bg-white px-3 py-6">
            <div className = "flex items-start justify-between gap-4">
                <div className="flex flex-col items-start gap-1">
                    <StatusBadge status={job.status} />
                    <h3 className="text-lg text-neutral-950">{job.title}</h3>
                    <JobMetaRow location={job.location} employmentType = {job.employmentType } />
                </div>

            </div>

        </article>
    )
}