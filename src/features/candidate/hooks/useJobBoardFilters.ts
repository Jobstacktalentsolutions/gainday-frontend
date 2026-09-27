import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { toJobBoardListing, type BackendJob } from "../utils/jobAdapter";
import {
    DEFAULT_JOB_BOARD_FILTERS,
    SALARY_BUCKETS,
    type FilterOption,
    type JobBoardFilters,
    type JobBoardListing,
} from "../types/jobBoard"

// GET /jobs already only returns ACTIVE jobs server-side (JobsService.findAllActive).
const fetchJobBoard = async (): Promise<JobBoardListing[]> => {
    const { data } = await apiClient.get<BackendJob[]>("/jobs");
    return data.map(toJobBoardListing);
};

function useJobBoardData(): { jobs: JobBoardListing[]; isLoading: boolean } {
    const query = useQuery({ queryKey: ["candidate", "job-board"], queryFn: fetchJobBoard });
    return { jobs: query.data ?? [], isLoading: query.isLoading };
}

function getUniqueOptions(
    jobs: JobBoardListing[],
    key: "roleCategory" | "location" | "employmentType",
): FilterOption[] {
    const unique = Array.from(new Set(jobs.map((job) => job[key])));
    return unique.sort().map((value) => ({ value, label: value }));
}

export function useJobBoardFilters() {
    const { jobs, isLoading } = useJobBoardData();
    const [filters, setFilters] = useState<JobBoardFilters>(DEFAULT_JOB_BOARD_FILTERS);

    const filterOptions = useMemo(
        () => ({
            roleCategory: getUniqueOptions(jobs, "roleCategory"),
            location: getUniqueOptions(jobs, "location"),
            employmentType: getUniqueOptions(jobs, "employmentType"),
            salaryBucket: SALARY_BUCKETS.map(({ value, label }) => ({ value, label })),
        }),
        [jobs],
    );

    const filteredJobs = useMemo(() => {
        const searchTerm = filters.search.trim().toLowerCase();
        const salaryBucket = SALARY_BUCKETS.find((bucket) => bucket.value === filters.salaryBucket);

        return jobs.filter((job) => {
            const matchesSearch = searchTerm.length === 0 || job.title.toLowerCase().includes(searchTerm);
            const matchesRole = !filters.roleCategory || job.roleCategory === filters.roleCategory;
            const matchesLocation = !filters.location || job.location === filters.location;
            const matchesEmploymentType =
                !filters.employmentType || job.employmentType === filters.employmentType;
            const matchesSalary =
                !salaryBucket ||
                ((job.salaryRange.min ?? 0) < salaryBucket.max &&
                    (job.salaryRange.max ?? Infinity) > salaryBucket.min);

            return matchesSearch && matchesRole && matchesLocation && matchesEmploymentType && matchesSalary;
        });
    }, [jobs, filters]);

    const hasActiveFilters =
        filters.search.trim().length > 0 ||
        filters.roleCategory !== null ||
        filters.location !== null ||
        filters.employmentType !== null ||
        filters.salaryBucket !== null;

    function updateFilter<K extends keyof JobBoardFilters>(key: K, value: JobBoardFilters[K]) {
        setFilters((previous) => ({ ...previous, [key]: value }));
    }

    function clearFilters() {
        setFilters(DEFAULT_JOB_BOARD_FILTERS);
    }

    return {
        isLoading,
        totalJobs: jobs.length,
        filteredJobs,
        filters,
        filterOptions,
        hasActiveFilters,
        updateFilter,
        clearFilters,
    };
}
