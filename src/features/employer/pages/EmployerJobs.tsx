import { useMemo, useState } from "react";
import EmployerPageHeader from "../components/EmployerPageHeader";
import JobStatusTabs from "../components/JobStatusTabs";
import JobCard, { JobCardSkeleton } from "../components/JobCard";
import JobsEmptyState from "../components/JobsEmptyState";
import { useEmployerJobs } from "../hooks/useEmployerJobs";
import type { Job , JobStatusFilter} from "../types/job";

const EmployerJobs = () => {
    const { data: jobs, isLoading} = useEmployerJobs();
    const [statusFilter, setStatusFilter] = useState<JobStatusFilter>("all");

    const filteredJobs = useMemo( () => {
        if (!jobs) return [];
        if (statusFilter === "all") return jobs;
        return jobs.filter((job) => job.status === statusFilter);
    }, [jobs,statusFilter]);
}