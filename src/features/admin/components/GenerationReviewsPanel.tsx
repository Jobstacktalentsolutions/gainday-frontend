import { useMemo, useState } from "react";
import { Search, ShieldAlert, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Layers } from "lucide-react";
import { useGenerationReviewJobs } from "../hooks/useGenerationReviews";
import GenerationReviewDetail from "./GenerationReviewDetail";
import { TableLoadMore } from "./TableLoadMore";
import { TableSkeleton } from "./skeletons";
import { cn } from "@/lib/utils";
import type {
  GenerationReviewItem,
  GenerationReviewJobGroup,
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

const matchesSearch = (group: GenerationReviewJobGroup, term: string) =>
  (group.job.title ?? "").toLowerCase().includes(term) ||
  group.jobId.toLowerCase().includes(term) ||
  group.items.some((item) => item.category.toLowerCase().includes(term));

const GenerationReviewsPanel = () => {
  const [statusFilter, setStatusFilter] = useState<
    GenerationReviewStatus | undefined
  >("PENDING");
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGenerationReviewJobs(statusFilter, 10);

  const groups = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );
  const totalCount = data?.pages[0]?.pagination.total ?? 0;

  const filteredGroups = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return groups;
    return groups.filter((group) => matchesSearch(group, term));
  }, [groups, searchTerm]);

  const selectFilter = (value: GenerationReviewStatus | undefined) => {
    setStatusFilter(value);
    setExpandedJobId(null);
    setSelectedItemId(null);
  };

  const toggleJob = (jobId: string) => {
    setExpandedJobId((current) => (current === jobId ? null : jobId));
    setSelectedItemId(null);
  };

  const toggleItem = (item: GenerationReviewItem) => {
    setSelectedItemId((current) => (current === item.id ? null : item.id));
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
                {totalCount} {totalCount === 1 ? "job" : "jobs"}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-neutral-500">
            Task slots where automated critic validation could not reach quality thresholds, grouped by job. A job's employer is emailed once every slot for it is resolved.
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

      {!isLoading && !isError && filteredGroups.length === 0 && (
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
        filteredGroups.map((group) => {
          const isOpen = expandedJobId === group.jobId;
          const isResolved = group.pendingCount === 0;
          return (
            <div key={group.jobId} className="border-b border-neutral-100 last:border-b-0">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleJob(group.jobId)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-neutral-50/80 cursor-pointer"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-neutral-900">
                      {group.job.title ?? "Untitled job"}
                    </p>
                    <span className="font-mono text-xs text-neutral-400">({group.jobId})</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                    <span>{group.job.employer.companyName ?? "Unknown company"}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                      <Layers className="size-3 text-neutral-500" />
                      {group.items.length} {group.items.length === 1 ? "slot" : "slots"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isResolved ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-success-200 bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-700">
                      <CheckCircle2 className="size-3" />
                      All resolved
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-warning-200 bg-warning-50 px-2.5 py-0.5 text-xs font-medium text-warning-700">
                      <AlertTriangle className="size-3" />
                      {group.pendingCount} pending
                    </span>
                  )}
                  <div className="flex size-7 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-400">
                    {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </div>
                </div>
              </button>

              {isOpen &&
                group.items.map((item) => {
                  const badge = STATUS_BADGE[item.status];
                  const isItemOpen = selectedItemId === item.id;
                  return (
                    <div key={item.id} className="border-t border-neutral-100 bg-neutral-50/40">
                      <button
                        type="button"
                        aria-expanded={isItemOpen}
                        onClick={() => toggleItem(item)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-neutral-50 cursor-pointer"
                      >
                        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                          <span className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[11px] font-medium text-neutral-700 border border-neutral-200">
                            Slot {item.slotIndex + 1}
                          </span>
                          <span className="font-medium text-neutral-600">{item.category}</span>
                          <span>·</span>
                          <span>{item.attempts.length} critic attempt(s)</span>
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
                          {isItemOpen ? (
                            <ChevronUp className="size-4 text-neutral-400" />
                          ) : (
                            <ChevronDown className="size-4 text-neutral-400" />
                          )}
                        </div>
                      </button>
                      {isItemOpen && (
                        <div className="border-t border-neutral-100 bg-neutral-50/50 p-5">
                          <GenerationReviewDetail review={item} onClose={() => setSelectedItemId(null)} />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          );
        })}

      {!isLoading && !isError && groups.length > 0 && (
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/30">
          <TableLoadMore
            currentCount={groups.length}
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
