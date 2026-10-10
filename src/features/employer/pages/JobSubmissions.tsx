import { useMemo } from "react";
import { useParams } from "react-router-dom";
import Skeleton from "@/components/ui/skeleton";
import PageBackLink from "../components/PageBackLink";
import SubmissionSortDropdown from "../components/SubmissionSortDropdown";
import SubmissionsTable, { SubmissionsTableSkeleton } from "../components/SubmissionTable";
import SubmissionsEmptyState from "../components/SubmissionsEmptyState";
import { useJobSubmissions } from "../hooks/useJobSubmissions";
import { useSubmissionSort } from "../hooks/useSubmissionSort";
import { SORT_CONFIG, sortSubmissions } from "../utils/submissionSort";
import { CATEGORY_ORDER } from "../utils/submissionCategories";
import { cn } from "@/lib/utils";

const JobSubmissions = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const { data, isLoading, isError, refetch } = useJobSubmissions(jobId);
    const { sort, setSort, isDefault, reset } = useSubmissionSort();

    const sortedSubmissions = useMemo(
        () => (data ? sortSubmissions(data.submissions, sort) : []),
        [data, sort],
    );

    const hasSubmissions = !!data && data.submissions.length > 0;

    return (
        <div className="min-h-screen bg-neutral-50 px-6 pb-30 pt-32 md:px-7.5 lg:px-12 xl:px-20">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
                <PageBackLink to="/employer/jobs">Go back to jobs posted</PageBackLink>

                <div className="flex flex-col items-start">
                    <h1 className="text-4xl text-black lg:text-5xl">All Submissions</h1>
                    {isLoading ? (
                        <Skeleton className="mt-2 h-6 w-64" />
                    ) : (
                        data && <p className="text-base uppercase text-primary-500">{data.jobTitle}</p>
                    )}
                </div>

                {!isLoading && !isError && hasSubmissions && (
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                            {SORT_CONFIG.map((config) => (
                                <SubmissionSortDropdown
                                    key={config.key}
                                    config={config}
                                    activeDirection={sort.key === config.key ? sort.direction : null}
                                    onSelect={(direction) => setSort({ key: config.key, direction })}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={reset}
                            disabled={isDefault}
                            className={cn(
                                "text-base text-primary-500 transition-opacity",
                                isDefault ? "cursor-default opacity-40" : "hover:underline",
                            )}
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {isLoading && <SubmissionsTableSkeleton />}

                {!isLoading && isError && (
                    <div className="w-full rounded-3xl border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
                        Something went wrong loading these submissions.{" "}
                        <button type="button" onClick={() => refetch()} className="underline">
                            Try again
                        </button>
                    </div>
                )}

                {!isLoading && !isError && (
                    hasSubmissions && jobId ? (
                        <div className="flex flex-col gap-2">
                            <SubmissionsTable jobId={jobId} submissions={sortedSubmissions} />
                            <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-xs text-neutral-400">
                                <span className="font-medium uppercase tracking-wide text-neutral-500">Breakdown key:</span>
                                {CATEGORY_ORDER.map((category) => (
                                    <span key={category.key}>
                                        <span className="font-semibold text-neutral-600">{category.short}</span>
                                        {" — "}
                                        {category.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <SubmissionsEmptyState />
                    )
                )}
            </div>
        </div>
    );
};

export default JobSubmissions;