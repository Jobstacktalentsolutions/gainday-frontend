import { useEffect, useState } from "react";
import { toast } from "sonner";
import AddItemButton from "@/components/ui/AddItemButton";

import JobStatusTabs from "../components/JobStatusTabs";
import JobCard, { JobCardSkeleton } from "../components/JobCard";
import JobsEmptyState from "../components/JobsEmptyState";
import EmployerPageHeader from "../components/EmployerPageHeader";
import DeleteJobModal from "../components/DeleteJobModal";
import JobPagination from "../components/JobPagination";
import { SearchField } from "@/features/candidate/components/SearchField";
import { useEmployerJobs } from "../hooks/useEmployerJobs";
import { useDeleteJob } from "../hooks/useDeleteJob";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { Job, JobStatusFilter } from "../types/job";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 9;

const EmployerJobs = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<JobStatusFilter>("all");
    const [page, setPage] = useState(1);

    const debouncedSearch = useDebouncedValue(search, 300);

    const { data, isLoading, isFetching, isError } = useEmployerJobs({
        search: debouncedSearch,
        status: statusFilter,
        page,
        limit: PAGE_SIZE,
    });

    const deleteJobMutation = useDeleteJob();
    const { user } = useCurrentUser();
    const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

    const isSearching = search !== debouncedSearch;
    const showSkeletons = isLoading || isSearching;

    const jobs = data?.jobs ?? [];
    const pagination = data?.pagination;
    const totalCount = pagination?.total ?? 0;
    const totalPages = pagination?.totalPages ?? 1;
    const totalAll = pagination?.totalAll ?? totalCount;

    // Safety guard: if page exceeds totalPages (e.g. after item deletion), clamp back
    useEffect(() => {
        if (pagination && page > totalPages && totalPages >= 1) {
            setPage(totalPages);
        }
    }, [pagination, page, totalPages]);

    const handleSearchChange = (val: string) => {
        setSearch(val);
        setPage(1);
    };

    const handleClearSearch = () => {
        setSearch("");
        setPage(1);
    };

    const handleStatusChange = (status: JobStatusFilter) => {
        setStatusFilter(status);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePostJob = () => {
        navigate("/employer/jobs/new");
    };

    const handleShareLink = async (job: Job) => {
        try {
            await navigator.clipboard.writeText(job.shareUrl);
            toast.success("Job link copied to clipboard");
        } catch {
            toast.error("Couldn't copy the link. Please try again.");
        }
    };

    const handleViewSubmissions = (job: Job) => {
        navigate(`/employer/jobs/${job.id}/submissions`);
    };

    const handleOpenPreview = (job: Job) => {
        navigate(`/employer/jobs/${job.id}/preview`);
    };

    const handleDeleteJob = (job: Job) => {
        setJobToDelete(job);
    };

    const handleConfirmDelete = async () => {
        if (!jobToDelete) return;
        try {
            await deleteJobMutation.mutateAsync(jobToDelete.id);
            toast.success("Job deleted successfully");
            setJobToDelete(null);
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Failed to delete job. Please try again.";
            toast.error(Array.isArray(msg) ? msg[0] : msg);
        }
    };

    const hasAnyJobs = totalAll > 0 || search.trim().length > 0 || statusFilter !== "all";

    return (
        <div className="min-h-screen bg-neutral-50 px-6 pb-10 pt-32 md:px-7.5 lg:px-12 xl:px-20">
            <div className="mx-auto flex w-full max-w-85.5 flex-col gap-10 md:max-w-none lg:max-w-4xl xl:max-w-6xl">

                {/* Mobile/Tablet: company name + Post a job button */}
                <div className="lg:hidden">
                    <EmployerPageHeader
                        employerName={user?.companyName ?? ""}
                        onPostJob={handlePostJob}
                    />
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-row justify-between items-start gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex flex-col items-start">
                            <h1 className="text-2xl text-black lg:text-3xl">Your jobs</h1>
                            <p className="text-neutral-500">Track every post, from draft to hire.</p>
                        </div>
                        {/* Desktop only: inline Post a job button */}
                        <AddItemButton onClick={handlePostJob} className="hidden lg:inline-flex">
                            Post a job
                        </AddItemButton>
                    </div>

                    {!isLoading && !isError && !hasAnyJobs ? (
                        <JobsEmptyState onPostJob={handlePostJob} />
                    ) : (
                        <>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <SearchField
                                    className="sm:w-auto sm:flex-1"
                                    value={search}
                                    onChange={handleSearchChange}
                                    placeholder="Search by job title, role, or location"
                                />
                                {search.trim().length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="cursor-pointer self-start text-[15px] text-primary-500 transition-colors hover:text-primary-700 sm:self-auto"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>

                            <JobStatusTabs value={statusFilter} onChange={handleStatusChange} />

                            {showSkeletons && (
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <JobCardSkeleton key={index} />
                                    ))}
                                </div>
                            )}

                            {!showSkeletons && isError && (
                                <div className="w-full rounded-3xl border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
                                    Something went wrong loading your jobs. Please refresh the page to try again.
                                </div>
                            )}

                            {!showSkeletons && !isError && (
                                jobs.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                                            {jobs.map((job) => (
                                                <JobCard
                                                    key={job.id}
                                                    job={job}
                                                    onShareLink={handleShareLink}
                                                    onViewSubmissions={handleViewSubmissions}
                                                    onOpenPreview={handleOpenPreview}
                                                    onDelete={handleDeleteJob}
                                                />
                                            ))}
                                        </div>

                                        <JobPagination
                                            currentPage={page}
                                            totalPages={totalPages}
                                            totalItems={totalCount}
                                            pageSize={PAGE_SIZE}
                                            onPageChange={handlePageChange}
                                            isLoading={isFetching}
                                        />
                                    </>
                                ) : search.trim().length > 0 ? (
                                    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-neutral-300 bg-white py-16 text-center">
                                        <p className="text-lg font-semibold text-neutral-900">No jobs found</p>
                                        <p className="text-sm text-neutral-500">No jobs match &ldquo;{search.trim()}&rdquo;.</p>
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            className="text-sm font-medium text-primary-600 hover:text-primary-800"
                                        >
                                            Clear search
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-neutral-300 bg-white py-16 text-center">
                                        <p className="text-lg font-semibold text-neutral-900">No jobs match your filter</p>
                                        <p className="text-sm text-neutral-500">
                                            No jobs found for this status tab.
                                        </p>
                                    </div>
                                )
                            )}
                        </>
                    )}

                </div>
            </div>

            <DeleteJobModal
                open={!!jobToDelete}
                job={jobToDelete}
                onConfirm={handleConfirmDelete}
                onDismiss={() => setJobToDelete(null)}
                isDeleting={deleteJobMutation.isPending}
            />
        </div>
    );
};

export default EmployerJobs;
