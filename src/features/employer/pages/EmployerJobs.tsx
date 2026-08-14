import { useMemo, useState } from "react";
import EmployerPageHeader from "../components/EmployerPageHeader";
import JobStatusTabs from "../components/JobStatusTabs";
import JobCard, { JobCardSkeleton } from "../components/JobCard";
import JobsEmptyState from "../components/JobsEmptyState";
import { useEmployerJobs } from "../hooks/useEmployerJobs";
import type { Job, JobStatusFilter } from "../types/job";

const EmployerJobs = () => {
    const { data: jobs, isLoading } = useEmployerJobs();
    const [statusFilter, setStatusFilter] = useState<JobStatusFilter>("all");

    const filteredJobs = useMemo(() => {
        if (!jobs) return [];
        if (statusFilter === "all") return jobs;
        return jobs.filter((job) => job.status === statusFilter);
    }, [jobs, statusFilter]);

    const handlePostJob = () => {
        //navigate("/employer/jobs/new")
    };

    const handleShareLink = (job: Job) => {
        // copy job.shareUrl to clipboard
    }

    const handleViewSubmissions = (job: Job) => {
        //navigate (/employer/jobs${job.id}/submissions)
    }

    const hasJobs = !!jobs && jobs.length > 0;

    return (
        <div className="min-h-screen bg-neutral-50 px-6 pb-10 pt-27">
            <div className="mx-auto flex w-full max-w-85.5 flex-col gap-10">
                <EmployerPageHeader employerName="Gett" onPostJob={handlePostJob} />

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-start">
                        <h1 className="text-2xl text-black">Your jobs</h1>
                        <p>Track every post, </p>
                    </div>
                    {!isLoading && hasJobs && (
                        <JobStatusTabs value={statusFilter} onChange={setStatusFilter} />
                    )}

                    {isLoading ? (
                        <div>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <JobCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : hasJobs ? (
                        <div className="flex w-full flex-col gap-4">
                            {filteredJobs.map((job) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    onShareLink={handleShareLink}
                                    onViewSubmissions={handleViewSubmissions}
                                />
                            ))}

                        </div>
                    ) : ()}


                </div>
            </div>
        </div>
    )

}

export default EmployerJobs;