import { useMemo, useState } from "react";
import { MOCK_JOBS } from "../mocks/mockJobs"
import {
    DEFAULT_JOB_BOARD_FILTERS,
    SALARY_BUCKETS,
    type FilterOption,
    type JobBoardFilters,
    type JobBoardListing,
} from "../types/jobBoard"



/**
 * TODO: replace with a real fetch hook once the public job board endpoint
 * exists, e.g.:
 *
 *   const { data, isLoading } = useQuery({
 *     queryKey: ["job-board"],
 *     queryFn: fetchPublicJobBoard,
 *   });
 *
 * The endpoint is expected to only return ACTIVE jobs and to denormalize
 * `employer.companyName` onto each job (see JobBoardListing). If it instead
 * returns every status or a bare `employerId`, this hook's filtering below
 * and the JobBoardEmployer assumption in job-board.types.ts both need updating.
 */
function useJobBoardData(): { jobs: JobBoardListing[]; isLoading: boolean } {
    const jobs = useMemo(() => MOCK_JOBS.filter((job) => job.status === "ACTIVE"), []);
    return { jobs, isLoading: false };

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
                (job.salaryRange.min < salaryBucket.max && job.salaryRange.max > salaryBucket.min);

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