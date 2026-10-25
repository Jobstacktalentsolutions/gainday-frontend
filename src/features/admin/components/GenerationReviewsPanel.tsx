import { useMemo, useState } from "react";
import { useGenerationReviews } from "../hooks/useGenerationReviews";
import GenerationReviewDetail from "./GenerationReviewDetail";
import { TableLoadMore } from "./TableLoadMore";
import { TableSkeleton } from "./skeletons";
import { cn } from "@/lib/utils";
import type {
  GenerationReviewItem,
  GenerationReviewStatus,
} from "../types/generationReview";

const FILTERS: { label: string; value: GenerationReviewStatus | undefined }[] =
  [
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED_WITH_EDITS" },
    { label: "Rejected", value: "REJECTED" },
    { label: "All", value: undefined },
  ];

const STATUS_BADGE: Record<
  GenerationReviewStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-warning-50 text-warning-600 border border-warning-200",
  },
  APPROVED_WITH_EDITS: {
    label: "Approved",
    className: "bg-success-50 text-success-600 border border-success-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-error-50 text-error-600 border border-error-200",
  },
};

const GenerationReviewsPanel = () => {
  const [statusFilter, setStatusFilter] = useState<
    GenerationReviewStatus | undefined
  >("PENDING");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGenerationReviews(statusFilter, 10);

  const reviews = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );
  const totalCount = data?.pages[0]?.pagination.total ?? 0;

  const selectFilter = (value: GenerationReviewStatus | undefined) => {
    setStatusFilter(value);
    setSelectedId(null);
  };

  const toggleReview = (review: GenerationReviewItem) => {
    setSelectedId((current) => (current === review.id ? null : review.id));
  };

  return (
    <section className="flex w-full flex-col overflow-hidden rounded-[10px] border border-neutral-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-neutral-100 px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-neutral-900">
            Generation Reviews
          </p>
          {!isLoading && !isError && (
            <span className="text-xs text-neutral-500">{totalCount} total</span>
          )}
        </div>
        <div
          role="group"
          aria-label="Filter by status"
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((filter) => (
            <button
              key={filter.label}
              type="button"
              aria-pressed={statusFilter === filter.value}
              onClick={() => selectFilter(filter.value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                statusFilter === filter.value
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <TableSkeleton rows={3} columns={3} showHeader={false} />}

      {isError && (
        <div className="px-5 py-8 text-center text-sm text-error-600">
          Something went wrong loading generation reviews.
        </div>
      )}

      {!isLoading && !isError && reviews.length === 0 && (
        <div className="px-5 py-8 text-center text-sm text-neutral-500">
          No review items here.
        </div>
      )}

      {!isLoading &&
        !isError &&
        reviews.map((review) => {
          const badge = STATUS_BADGE[review.status];
          const isOpen = selectedId === review.id;
          return (
            <div
              key={review.id}
              className="border-b border-neutral-100 last:border-b-0"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleReview(review)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-neutral-50 cursor-pointer"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="truncate text-sm font-medium text-neutral-900">
                    {review.job?.title ?? "Untitled job"}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Slot {review.slotIndex + 1} · {review.category} ·{" "}
                    {review.attempts.length} failed attempt(s)
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                    badge.className,
                  )}
                >
                  {badge.label}
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5">
                  <GenerationReviewDetail
                    review={review}
                    onClose={() => setSelectedId(null)}
                  />
                </div>
              )}
            </div>
          );
        })}

      {!isLoading && !isError && reviews.length > 0 && (
        <div className="px-5 py-4">
          <TableLoadMore
            currentCount={reviews.length}
            totalCount={totalCount}
            hasNextPage={hasNextPage}
            isLoading={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
          />
        </div>
      )}
    </section>
  );
};

export default GenerationReviewsPanel;
