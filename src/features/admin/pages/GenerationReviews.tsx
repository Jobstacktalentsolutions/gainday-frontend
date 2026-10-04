import { useState, useMemo } from "react";
import { useGenerationReviews } from "../hooks/useGenerationReviews";
import GenerationReviewDetail from "../components/GenerationReviewDetail";
import { TableLoadMore } from "../components/TableLoadMore";
import type { GenerationReviewStatus } from "../types/generationReview";
import { TableSkeleton } from "../components/skeletons";

const STATUS_FILTERS: { label: string; value: GenerationReviewStatus | undefined }[] = [
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED_WITH_EDITS" },
    { label: "Rejected", value: "REJECTED" },
    { label: "All", value: undefined },
];

const GenerationReviews = () => {
    const [statusFilter, setStatusFilter] = useState<GenerationReviewStatus | undefined>(
        "PENDING",
    );
    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useGenerationReviews(statusFilter, 10);

    const [selectedId, setSelectedId] = useState<string | null>(null);

    const allReviews = useMemo(
        () => data?.pages.flatMap((page) => page.items) ?? [],
        [data]
    );
    const totalCount = data?.pages[0]?.pagination.total ?? 0;

    const selected = allReviews.find((r) => r.id === selectedId) ?? null;

    return (
        <>
            <h1 className="text-2xl font-semibold text-neutral-900">Generation Reviews</h1>
            <p className="text-sm text-neutral-500">
                Task slots the generation pipeline couldn't validate automatically — review the
                failed attempts, fix the content, and approve or reject.
            </p>

            <div className="flex gap-2">
                {STATUS_FILTERS.map((filter) => (
                    <button
                        key={filter.label}
                        type="button"
                        onClick={() => {
                            setStatusFilter(filter.value);
                            setSelectedId(null);
                        }}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                            statusFilter === filter.value
                                ? "bg-primary-500 text-white"
                                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {isLoading && <TableSkeleton rows={5} columns={4} showHeader={false} />}

            {isError && (
                <div className="w-full rounded-[10px] border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
                    Something went wrong loading generation reviews.
                </div>
            )}

            {!isLoading && !isError && (
                <div className="flex flex-col gap-3">
                    {allReviews.length === 0 && (
                        <div className="w-full rounded-[10px] border border-neutral-200 bg-white px-5 py-10 text-center text-sm text-neutral-500">
                            No review items here.
                        </div>
                    )}
                    {allReviews.map((review) => (
                        <div key={review.id} className="flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedId((current) =>
                                        current === review.id ? null : review.id,
                                    )
                                }
                                className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-5 py-4 text-left transition-colors hover:bg-neutral-50 cursor-pointer"
                            >
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium text-neutral-900">
                                        {review.job?.title ?? "Untitled job"} — slot{" "}
                                        {review.slotIndex + 1}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        {review.category} · {review.attempts.length} failed
                                        attempt(s) · {review.status}
                                    </p>
                                </div>
                            </button>
                            {selected?.id === review.id && (
                                <GenerationReviewDetail
                                    review={review}
                                    onClose={() => setSelectedId(null)}
                                />
                            )}
                        </div>
                    ))}

                    <TableLoadMore
                        currentCount={allReviews.length}
                        totalCount={totalCount}
                        hasNextPage={hasNextPage}
                        isLoading={isFetchingNextPage}
                        onLoadMore={() => fetchNextPage()}
                    />
                </div>
            )}
        </>
    );
};

export default GenerationReviews;
