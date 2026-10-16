import { useMemo, useState } from "react";
import {
  Clock,
  RotateCcw,
  CheckCircle2,
  Inbox,
  Search,
} from "lucide-react";
import {
  useSupportMessages,
  useSupportStats,
  useUpdateSupportStatus,
} from "../hooks/useSupportMessages";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { SupportMessagesTable } from "../components/SupportMessagesTable";
import { ViewSupportMessageDialog } from "../components/ViewSupportMessageDialog";
import { TableLoadMore } from "../components/TableLoadMore";
import { TableSkeleton } from "../components/skeletons";
import type { SupportMessage } from "../types/support";
import { cn } from "@/lib/utils";

type FilterStatus = "all" | "pending" | "read" | "in_progress" | "resolved";

const SupportMessages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 300);
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("all");
  const [activeMessage, setActiveMessage] = useState<SupportMessage | null>(null);

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSupportMessages({
    search: debouncedSearch,
    status: selectedStatus,
    limit: 10,
  });

  const { data: stats } = useSupportStats();
  const updateStatusMutation = useUpdateSupportStatus();

  const allMessages = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );
  const totalCount = data?.pages[0]?.pagination.total ?? 0;

  const handleToggleRead = (message: SupportMessage) => {
    const newStatus = message.status === "pending" ? "read" : "pending";
    updateStatusMutation.mutate({ id: message.id, status: newStatus });
  };

  const handleViewMessage = (message: SupportMessage) => {
    // If opening an unread/pending message, automatically mark as read
    if (message.status === "pending") {
      updateStatusMutation.mutate({ id: message.id, status: "read" });
      setActiveMessage({ ...message, status: "read" });
    } else {
      setActiveMessage(message);
    }
  };

  const filterTabs: { id: FilterStatus; label: string; count?: number }[] = [
    { id: "all", label: "All Inquiries", count: stats?.total },
    { id: "pending", label: "Unread / Pending", count: stats?.pending },
    { id: "read", label: "Read", count: stats?.read },
    { id: "in_progress", label: "In Progress", count: stats?.inProgress },
    { id: "resolved", label: "Resolved", count: stats?.resolved },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Support & User Inquiries
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage user appeals, technical requests, and support tickets with full follow-up tracking
          </p>
        </div>
      </div>

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Total Inquiries</span>
            <Inbox className="size-4 text-neutral-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-neutral-900">
            {stats?.total ?? 0}
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Unread / Pending</span>
            <Clock className="size-4 text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-900">
            {stats?.pending ?? 0}
          </p>
        </div>

        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700">In Progress</span>
            <RotateCcw className="size-4 text-purple-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-900">
            {stats?.inProgress ?? 0}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Resolved</span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-900">
            {stats?.resolved ?? 0}
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-100/70 p-1">
          {filterTabs.map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatus(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                  isActive
                    ? "bg-white text-neutral-900 shadow-xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50"
                )}
              >
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px]",
                      isActive
                        ? "bg-neutral-100 text-neutral-800"
                        : "bg-neutral-200 text-neutral-600"
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sender, topic, message..."
            className="h-9 w-full rounded-lg border border-neutral-200 bg-white pl-8 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Content Area */}
      {isLoading && <TableSkeleton rows={6} columns={5} showHeader={false} />}

      {isError && (
        <div className="w-full rounded-[10px] border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
          Something went wrong loading support inquiries. Please try refreshing.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="flex flex-col gap-3">
          <SupportMessagesTable
            messages={allMessages}
            onView={handleViewMessage}
            onToggleRead={handleToggleRead}
            isUpdatingStatus={updateStatusMutation.isPending}
          />

          <TableLoadMore
            currentCount={allMessages.length}
            totalCount={totalCount}
            hasNextPage={hasNextPage}
            isLoading={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
          />
        </div>
      )}

      {/* Details & Actions Modal */}
      <ViewSupportMessageDialog
        message={activeMessage}
        open={Boolean(activeMessage)}
        onOpenChange={(open) => {
          if (!open) setActiveMessage(null);
        }}
      />
    </div>
  );
};

export default SupportMessages;
