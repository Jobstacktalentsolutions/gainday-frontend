import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CandidateHeader from "../components/CandidateHeader";
import { SearchField } from "../components/SearchField";
import { FilterDropdown } from "../components/Filterdropdown";
import { JobCard } from "../components/JobCard";
import { EmptyJobBoardState } from "../components/EmptyJobBoardState";
import { NoResultsState } from "../components/NoFilterResult";
import { useJobBoardFilters } from "../hooks/useJobBoardFilters";
import type { JobBoardListing } from "../types/jobBoard";

export function JobBoardPage() {
    const navigate = useNavigate();
    const {
        isLoading,
        totalJobs,
        filteredJobs,
        filters,
        filterOptions,
        hasActiveFilters,
        updateFilter,
        clearFilters,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useJobBoardFilters();

    // Loads the next page when the sentinel below the grid scrolls into view.
    const sentinelRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !hasNextPage) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && !isFetchingNextPage) fetchNextPage();
            },
            { rootMargin: "400px" },
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    function handleApply(job: JobBoardListing) {
        navigate(`/job-board/${job.id}`);
    }

    return (
        <div className="min-h-screen w-full bg-neutral-50">
            <CandidateHeader />

            <main className="mx-auto flex w-full max-w-300 flex-col gap-10 px-5 pb-20 pt-33.75 sm:pt-43.75 lg:px-0">
                <div className="flex flex-col">
                    <h1 className="text-[32px] leading-[1.2] text-black sm:text-[48px] sm:leading-14.5 sm:tracking-[-0.48px]">
                        Find your next role
                    </h1>
                    <p className="text-[16px] text-neutral-700">
                        Real work simulations, not keyword-matched rejections.
                    </p>
                </div>

                <div className="flex w-full flex-wrap items-center gap-4 sm:gap-6">
                    <SearchField value={filters.search} onChange={(value) => updateFilter("search", value)} />

                    <div className="flex flex-wrap items-center gap-3">
                        <FilterDropdown
                            allLabel="All Roles"
                            options={filterOptions.roleCategory}
                            selectedValue={filters.roleCategory}
                            onSelect={(value) => updateFilter("roleCategory", value)}
                        />
                        <FilterDropdown
                            allLabel="All Locations"
                            options={filterOptions.location}
                            selectedValue={filters.location}
                            onSelect={(value) => updateFilter("location", value)}
                        />
                        <FilterDropdown
                            allLabel="All Employment Types"
                            options={filterOptions.employmentType}
                            selectedValue={filters.employmentType}
                            onSelect={(value) => updateFilter("employmentType", value)}
                        />
                        <FilterDropdown
                            allLabel="Any Salary"
                            options={filterOptions.salaryBucket}
                            selectedValue={filters.salaryBucket}
                            onSelect={(value) => updateFilter("salaryBucket", value)}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={clearFilters}
                        disabled={!hasActiveFilters}
                        className="cursor-pointer text-[16px] text-primary-500 transition-colors hover:text-primary-700 disabled:cursor-default disabled:opacity-40"
                    >
                        Clear filters
                    </button>
                </div>

                {!isLoading && totalJobs === 0 && <EmptyJobBoardState />}

                {!isLoading && totalJobs > 0 && filteredJobs.length === 0 && (
                    <NoResultsState onClearFilters={clearFilters} />
                )}

                {!isLoading && filteredJobs.length > 0 && (
                    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredJobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                isApplied={job.isApplied === true}
                                onApply={handleApply}
                            />
                        ))}
                    </div>
                )}

                {!isLoading && filteredJobs.length > 0 && (
                    <div ref={sentinelRef} className="flex h-10 items-center justify-center text-[14px] text-neutral-500">
                        {isFetchingNextPage ? "Loading more roles…" : null}
                    </div>
                )}
            </main>
        </div>
    );
}

export default JobBoardPage;