import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertOctagon,
  AlertTriangle,
  BellRing,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Info,
} from "lucide-react";
import { AdminButton } from "@/components/ui/AdminButton";
import { cn } from "@/lib/utils";
import {
  useAdminNotifications,
  useAdminNotificationStats,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "../hooks/useAdminNotifications";
import type { AdminNotification, NotificationSeverity } from "../types/notification";

const SEVERITY_CONFIG: Record<
  NotificationSeverity,
  { label: string; badge: string; icon: typeof Info; border: string; bg: string }
> = {
  CRITICAL: {
    label: "Critical",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
    border: "border-rose-200",
    bg: "bg-rose-50/30",
    icon: AlertOctagon,
  },
  WARNING: {
    label: "Warning",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    border: "border-amber-200",
    bg: "bg-amber-50/30",
    icon: AlertTriangle,
  },
  INFO: {
    label: "Info",
    badge: "bg-sky-100 text-sky-800 border-sky-200",
    border: "border-sky-200",
    bg: "bg-sky-50/30",
    icon: Info,
  },
};

const formatTimeAgo = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

export const DashboardSystemAlerts = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useAdminNotificationStats();

  // If there are unread notifications, default filter to unread, otherwise all
  const [filterMode, setFilterMode] = useState<"unread" | "all">("unread");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Fetch notifications based on the current filter mode
  const { data, isLoading } = useAdminNotifications({
    unreadOnly: filterMode === "unread",
    limit: 4,
  });

  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = useMemo(
    () => data?.pages[0]?.items ?? [],
    [data]
  );

  // If loading or no alerts exist at all in the database, don't show the component
  if (statsLoading || !stats || (stats.total === 0 && stats.unread === 0)) {
    return null;
  }

  const hasUnread = stats.unread > 0;
  const hasCriticalUnread = stats.criticalUnread > 0;

  return (
    <section
      className={cn(
        "flex flex-col rounded-xl border bg-white p-5 shadow-xs transition-all",
        hasCriticalUnread
          ? "border-rose-300 ring-1 ring-rose-200"
          : hasUnread
          ? "border-amber-300 ring-1 ring-amber-100"
          : "border-neutral-200"
      )}
    >
      {/* Header bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-neutral-100">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              hasCriticalUnread
                ? "bg-rose-100 text-rose-700"
                : hasUnread
                ? "bg-amber-100 text-amber-700"
                : "bg-neutral-100 text-neutral-600"
            )}
          >
            {hasCriticalUnread ? (
              <AlertOctagon className="w-4 h-4 animate-pulse" />
            ) : hasUnread ? (
              <BellRing className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-900">
                System Alerts
              </h2>
              {hasCriticalUnread && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-800 border border-rose-200 animate-pulse">
                  {stats.criticalUnread} Critical
                </span>
              )}
              {hasUnread && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200">
                  {stats.unread} Unread
                </span>
              )}
              {!hasUnread && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                  All Read
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Automated operational telemetry, pipeline failures, and grading anomalies
            </p>
          </div>
        </div>

        {/* Action buttons and filter toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex rounded-lg border border-neutral-200 bg-neutral-100/70 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setFilterMode("unread")}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer",
                filterMode === "unread"
                  ? "bg-white font-semibold text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Unread ({stats.unread})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer",
                filterMode === "all"
                  ? "bg-white font-semibold text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              All ({stats.total})
            </button>
          </div>

          {hasUnread && (
            <AdminButton
              variant="outline"
              size="sm"
              disabled={markAllRead.isPending}
              onClick={() => markAllRead.mutate()}
              className="text-xs h-7 px-2.5 cursor-pointer"
            >
              Mark all read
            </AdminButton>
          )}

          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/notifications")}
            className="text-xs h-7 px-2.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50 cursor-pointer flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </AdminButton>
        </div>
      </div>

      {/* Alert items list */}
      <div className="divide-y divide-neutral-100 mt-1">
        {isLoading ? (
          <div className="py-6 text-center text-xs text-neutral-400">
            Loading system alerts...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-500">
            {filterMode === "unread"
              ? "No unread alerts at this time. All caught up!"
              : "No system alerts recorded."}
          </div>
        ) : (
          notifications.map((item: AdminNotification) => {
            const config = SEVERITY_CONFIG[item.severity];
            const Icon = config.icon;
            const isUnread = item.readAt === null;
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={cn(
                  "py-3 transition-colors rounded-lg px-2",
                  isUnread ? config.bg : "hover:bg-neutral-50/60"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold shrink-0 mt-0.5",
                        config.badge
                      )}
                    >
                      <Icon className="w-2.5 h-2.5" />
                      {config.label}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            "text-xs text-neutral-900 truncate",
                            isUnread ? "font-bold text-neutral-950" : "font-medium"
                          )}
                        >
                          {item.title}
                        </p>
                        {isUnread && (
                          <span className="size-1.5 rounded-full bg-primary-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-600 line-clamp-1 mt-0.5">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions & timestamp */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-neutral-400">
                      {formatTimeAgo(item.createdAt)}
                    </span>

                    {item.metadata?.jobId && (
                      <Link
                        to={
                          item.metadata.submissionId
                            ? `/admin/content-moderation/jobs/${item.metadata.jobId}?submission=${item.metadata.submissionId}`
                            : `/admin/content-moderation/jobs/${item.metadata.jobId}`
                        }
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-primary-600 hover:text-primary-700 bg-white border border-neutral-200 hover:border-neutral-300 rounded px-2 py-0.5 transition-colors"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    )}

                    {isUnread && (
                      <button
                        type="button"
                        disabled={markRead.isPending}
                        onClick={() => markRead.mutate(item.id)}
                        className="text-[11px] font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 hover:border-neutral-300 rounded px-2 py-0.5 transition-colors cursor-pointer"
                      >
                        Mark read
                      </button>
                    )}

                    {item.details && (
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() =>
                          setExpandedId(isExpanded ? null : item.id)
                        }
                        className="text-neutral-400 hover:text-neutral-600 p-0.5 transition-colors cursor-pointer"
                        title="View alert details"
                      >
                        <ChevronDown
                          className={cn(
                            "w-3.5 h-3.5 transition-transform",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && item.details && (
                  <div className="mt-2.5 pl-8 pr-2">
                    <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words rounded border border-neutral-200 bg-neutral-900 text-neutral-100 p-2.5 font-mono text-[11px] leading-relaxed">
                      {item.details}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {stats.total > 4 && (
        <div className="pt-2.5 mt-1 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span>
            Showing top {Math.min(notifications.length, 4)} of {stats.total} total system alerts
          </span>
          <button
            type="button"
            onClick={() => navigate("/admin/notifications")}
            className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer flex items-center gap-1"
          >
            Open Notifications Console <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
};
