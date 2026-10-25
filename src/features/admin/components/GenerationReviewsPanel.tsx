import { useMemo, useState } from "react";
import { Search, ShieldAlert, AlertTriangle, ChevronDown, ChevronUp, Layers } from "lucide-react";
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
    label: "Pending Review",
    className: "bg-warning-50 text-warning-700 border-warning-200",
  },
  APPROVED_WITH_EDITS: {
    label: "Approved",
    className: "bg-success-50 text-success-700 border-success-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-error-50 text-error-700 border-error-200",
  },
};

const GenerationReviewsPanel = () => {
  const [statusFilter, setStatusFilter] = useState<
    GenerationReviewStatus | undefined
  >("PENDING");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredReviews = useMemo(() => {
    if (!searchTerm.trim()) return reviews;
    const term = searchTerm.toLowerCase().trim();
    return reviews.filter(
      (r) =>
        (r.job?.title && r.job.title.toLowerCase().includes(term)) ||
        r.category.toLowerCase().includes(term) ||
        r.jobId.toLowerCase().includes(term)
    );
  }, [reviews, searchTerm]);

  const selectFilter = (value: GenerationReviewStatus | undefined) => {
    setStatusFilter(value);
    setSelectedId(null);
  };

  const toggleReview = (review: GenerationReviewItem) => {
    setSelectedId((current) => (current === review.id ? null : review.id));
  };

  return (
    <section className="flex w-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs">
      {/* Header & Context */}
      <div className="flex flex-col gap-3 border-b border-neutral-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-neutral-900">
              Generation Reviews Queue (Critic Fallbacks)
            </h2>
            {!isLoading && !isError && (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-600">
                {totalCount} total
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-neutral-500">
            Task slots where automated critic validation could not reach quality thresholds. Inspect failed attempts, adjust prompts, and approve with edits.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 border-b border-neutral-100 bg-neutral-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title, category, or Job ID..."
            className="h-9.5 w-full rounded-lg border border-neutral-200 bg-white pl-9.5 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>

        <div
          role="group"
          aria-label="Filter by status"
          className="flex flex-wrap items-center gap-1.5"
        >
          {FILTERS.map((filter) => (
            <button
              key={filter.label}
              type="button"
              aria-pressed={statusFilter === filter.value}
              onClick={() => selectFilter(filter.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                statusFilter === filter.value
                  ? "bg-primary-600 text-white shadow-xs"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <TableSkeleton rows={3} columns={3} showHeader={false} />}

      {isError && (
        <div className="p-8 text-center text-sm text-error-600 bg-error-50/50">
          Something went wrong loading generation reviews.
        </div>
      )}

      {!isLoading && !isError && filteredReviews.length === 0 && (
        <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 mb-3">
            <ShieldAlert className="size-5" />
          </div>
          <p className="text-sm font-semibold text-neutral-900">
            No review items found
          </p>
          <p className="mt-1 text-xs text-neutral-500 max-w-sm">
            {searchTerm
              ? `No review records match "${searchTerm}".`
              : "All generation slots have satisfied automated critic validation criteria."}
          </p>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="mt-3 text-xs font-semibold text-primary-600 hover:text-primary-700 cursor-pointer"
            >
              Clear search filter
            </button>
          )}
        </div>
      )}

      {!isLoading &&
        !isError &&
        filteredReviews.map((review) => {
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
                className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-neutral-50/80 cursor-pointer"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-neutral-900">
                      {review.job?.title ?? "Untitled job"}
                    </p>
                    <span className="font-mono text-xs text-neutral-400">
                      ({review.jobId})
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                      <Layers className="size-3 text-neutral-500" />
                      Slot {review.slotIndex + 1}
                    </span>
                    <span>·</span>
                    <span className="font-medium text-neutral-600">{review.category}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 text-amber-700">
                      <AlertTriangle className="size-3" />
                      {review.attempts.length} critic attempt(s)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      badge.className,
                    )}
                  >
                    {badge.label}
                  </span>
                  <div className="flex size-7 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-400">
                    {isOpen ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </div>
                </div>
              </button>
              {isOpen && (
                <div className="border-t border-neutral-100 bg-neutral-50/50 p-5">
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
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/30">
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
