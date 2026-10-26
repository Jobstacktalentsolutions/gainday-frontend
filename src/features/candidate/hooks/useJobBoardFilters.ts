import { useMemo, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { toJobBoardListing, type BackendJob } from "../utils/jobAdapter";
import {
    APPLIED_OPTIONS,
    DEFAULT_JOB_BOARD_FILTERS,
    SALARY_BUCKETS,
    SORT_OPTIONS,
    type FilterOption,
    type JobBoardFilters,
    type JobBoardListing,
} from "../types/jobBoard";

const PAGE_SIZE = 12;

interface BoardPageResponse {
    items: (BackendJob & { isApplied: boolean })[];
    total: number;
    nextOffset: number | null;
}

interface BoardOptionsResponse {
    totalActive: number;
    roleCategory: string[];
    location: string[];
    employmentType: string[];
}

// The filters the server understands. Empty filters are left out of the request.
interface BoardQueryParams {
    search?: string;
    sort?: string;
    appliedStatus?: string;
    location?: string;
    employmentType?: string;
    salaryMin?: number;
    salaryMax?: number;
}

const toOptions = (values: string[]): FilterOption[] => values.map((value) => ({ value, label: value }));

function toQueryParams(filters: JobBoardFilters, search: string): BoardQueryParams {
    const bucket = SALARY_BUCKETS.find((item) => item.value === filters.salaryBucket);
    return {
        search: search.trim() || undefined,
        sort: filters.sort ?? undefined,
        appliedStatus: filters.appliedStatus ?? undefined,
        location: filters.location ?? undefined,
        employmentType: filters.employmentType ?? undefined,
        salaryMin: bucket?.min,
        // Infinity cannot be sent as a query value, so the open-ended bucket has no upper bound.
        salaryMax: bucket && Number.isFinite(bucket.max) ? bucket.max : undefined,
    };
}

async function fetchBoardPage(params: BoardQueryParams, offset: number): Promise<BoardPageResponse> {
    const { data } = await apiClient.get<BoardPageResponse>("/jobs/board", {
        params: { ...params, offset, limit: PAGE_SIZE },
    });
    return data;
}

async function fetchBoardOptions(): Promise<BoardOptionsResponse> {
    const { data } = await apiClient.get<BoardOptionsResponse>("/jobs/board/options");
    return data;
}

export function useJobBoardFilters() {
    const { user, isAuthenticated } = useCurrentUser();
    const isCandidate = isAuthenticated && user?.role === "JOB_SEEKER";
    const [filters, setFilters] = useState<JobBoardFilters>(DEFAULT_JOB_BOARD_FILTERS);
    const debouncedSearch = useDebouncedValue(filters.search, 300);
    const params = toQueryParams(filters, debouncedSearch);

    // The board ranks differently for a candidate, so each viewer gets their own cached pages.
    const feed = useInfiniteQuery({
        queryKey: ["candidate", "job-board", user?.id ?? "guest", params],
        queryFn: ({ pageParam }) => fetchBoardPage(params, pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    });

    const optionsQuery = useQuery({
        queryKey: ["candidate", "job-board", "options"],
        queryFn: fetchBoardOptions,
    });

    const jobs: JobBoardListing[] = useMemo(() => {
        const rawJobs = (feed.data?.pages ?? []).flatMap((page) =>
            page.items.map((item) => ({ ...toJobBoardListing(item), isApplied: item.isApplied })),
        );
        if (!filters.appliedStatus) return rawJobs;
        if (filters.appliedStatus === "applied") {
            return rawJobs.filter((job) => job.isApplied === true);
        }
        if (filters.appliedStatus === "not-applied") {
            return rawJobs.filter((job) => job.isApplied !== true);
        }
        return rawJobs;
    }, [feed.data, filters.appliedStatus]);

    const filterOptions = useMemo(
        () => ({
            sort: SORT_OPTIONS,
            appliedStatus: APPLIED_OPTIONS,
            location: toOptions(optionsQuery.data?.location ?? []),
            employmentType: toOptions(optionsQuery.data?.employmentType ?? []),
            salaryBucket: SALARY_BUCKETS.map(({ value, label }) => ({ value, label })),
        }),
        [optionsQuery.data],
    );

    const hasActiveFilters =
        filters.search.trim().length > 0 ||
        filters.sort !== null ||
        filters.appliedStatus !== null ||
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
        isLoading: feed.isLoading,
        // Live jobs across the whole board, so the empty state can tell "no jobs" from "no matches".
        totalJobs: optionsQuery.data?.totalActive ?? 0,
        isCandidate,
        filteredJobs: jobs,
        filters,
        filterOptions,
        hasActiveFilters,
        updateFilter,
        clearFilters,
        hasNextPage: feed.hasNextPage,
        isFetchingNextPage: feed.isFetchingNextPage,
        fetchNextPage: feed.fetchNextPage,
    };
}
