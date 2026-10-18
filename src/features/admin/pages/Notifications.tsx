import { useMemo, useState } from "react";
import { AlertOctagon, BellRing, Inbox } from "lucide-react";
import { AdminButton } from "@/components/ui/AdminButton";
import { cn } from "@/lib/utils";
import {
  useAdminNotifications,
  useAdminNotificationStats,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "../hooks/useAdminNotifications";
import { AdminNotificationsTable } from "../components/AdminNotificationsTable";
import { TableLoadMore } from "../components/TableLoadMore";
import { TableSkeleton } from "../components/skeletons";
import type { AdminNotificationQueryParams } from "../types/notification";

type FilterId = "all" | "unread" | "critical";

const FILTER_PARAMS: Record<FilterId, AdminNotificationQueryParams> = {
  all: {},
  unread: { unreadOnly: true },
  critical: { severity: "CRITICAL" },
};

const FILTER_TABS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "critical", label: "Critical" },
];

const Notifications = () => {
  const [filter, setFilter] = useState<FilterId>("all");

  const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useAdminNotifications({
    ...FILTER_PARAMS[filter],
    limit: 10,
  });
  const { data: stats } = useAdminNotificationStats();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const totalCount = data?.pages[0]?.pagination.total ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Notifications</h1>
          <p className="mt-0.5 text-xs text-neutral-500">
            System alerts that need an admin, such as submissions that could not be graded
          </p>
        </div>
        <AdminButton
          variant="outline"
          size="sm"
          disabled={!stats?.unread || markAllRead.isPending}
          onClick={() => markAllRead.mutate()}
        >
          Mark all as read
        </AdminButton>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Total</span>
            <Inbox className="size-4 text-neutral-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-neutral-900">{stats?.total ?? 0}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Unread</span>
            <BellRing className="size-4 text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-900">{stats?.unread ?? 0}</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">Critical, unread</span>
            <AlertOctagon className="size-4 text-rose-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-900">{stats?.criticalUnread ?? 0}</p>
        </div>
      </div>

      <div className="flex w-fit flex-wrap items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-100/70 p-1">
        {FILTER_TABS.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                "cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-white font-semibold text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:bg-neutral-200/50 hover:text-neutral-900",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {isLoading && <TableSkeleton rows={6} columns={4} showHeader={false} />}

      {isError && (
        <div className="w-full rounded-[10px] border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
          Something went wrong loading notifications. Please try refreshing.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="flex flex-col gap-3">
          <AdminNotificationsTable
            notifications={notifications}
            onMarkRead={(notification) => markRead.mutate(notification.id)}
            isUpdating={markRead.isPending}
          />
          <TableLoadMore
            currentCount={notifications.length}
            totalCount={totalCount}
            hasNextPage={hasNextPage}
            isLoading={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
          />
        </div>
      )}
    </div>
  );
};

export default Notifications;
