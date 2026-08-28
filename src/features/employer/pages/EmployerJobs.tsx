import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import JobStatusTabs from "../components/JobStatusTabs";
import JobCard, { JobCardSkeleton } from "../components/JobCard";
import JobsEmptyState from "../components/JobsEmptyState";
import { useEmployerJobs } from "../hooks/useEmployerJobs";
import type { Job, JobStatusFilter } from "../types/job";
import { useNavigate } from "react-router-dom";

const EmployerJobs = () => {
    const navigate = useNavigate();
    const { data: jobs, isLoading } = useEmployerJobs();
    const [statusFilter, setStatusFilter] = useState<JobStatusFilter>("all");

    const filteredJobs = useMemo(() => {
        if (!jobs) return [];
        if (statusFilter === "all") return jobs;
        return jobs.filter((job) => job.status === statusFilter);
    }, [jobs, statusFilter]);

    const handlePostJob = () => {
        navigate("/employer/jobs/new")
    };

    const handleShareLink = (job: Job) => {
        // copy job.shareUrl to clipboard
        console.log(job)
    }

    const handleViewSubmissions = (job: Job) => {
        //navigate (/employer/jobs${job.id}/submissions)
        console.log(job) // to stall deployment issues
    }

    const hasJobs = !!jobs && jobs.length > 0;

    return (
        <div className="min-h-screen bg-neutral-50 px-6 pb-10 pt-32 lg:px-12 xl:px-20">
            <div className="mx-auto flex w-full max-w-85.5 flex-col gap-10 lg:max-w-4xl xl:max-w-6xl">


                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex flex-col items-start">
                            <h1 className="text-2xl text-black lg:text-3xl">Your jobs</h1>
                            <p className="text-neutral-500">Track every post, from draft to hire.</p>
                        </div>
                        <div className="hidden lg:block">
                            <button
                                type="button"
                                onClick={handlePostJob}
                                className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-500 py-1 pl-4 pr-1 text-base text-neutral-50"
                            >
                                <span>Post a job</span>
                                <span className="flex size-8 items-center justify-center rounded-lg bg-secondary-500">
                                    <Plus className="size-4 text-white" aria-hidden="true" />
                                </span>
                            </button>
                        </div>
                    </div>
                    {!isLoading && hasJobs && (
                        <JobStatusTabs value={statusFilter} onChange={setStatusFilter} />
                    )}

                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <JobCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : hasJobs ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredJobs.map((job) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    onShareLink={handleShareLink}
                                    onViewSubmissions={handleViewSubmissions}
                                />
                            ))}
                        </div>
                    ) : (
                        <JobsEmptyState onPostJob={handlePostJob} />
                    )}


                </div>
            </div>
        </div>
    )

}

export default EmployerJobs;