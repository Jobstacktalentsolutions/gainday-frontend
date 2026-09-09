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