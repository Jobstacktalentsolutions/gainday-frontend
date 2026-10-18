import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertOctagon, AlertTriangle, ChevronDown, Info } from "lucide-react";
import { AdminButton } from "@/components/ui/AdminButton";
import { cn } from "@/lib/utils";
import type { AdminNotification, NotificationSeverity } from "../types/notification";

interface AdminNotificationsTableProps {
  notifications: AdminNotification[];
  onMarkRead: (notification: AdminNotification) => void;
  isUpdating: boolean;
}

const SEVERITY_STYLE: Record<NotificationSeverity, { label: string; badge: string; row: string; icon: typeof Info }> = {
  CRITICAL: {
    label: "Critical",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
    row: "bg-rose-50/40 hover:bg-rose-50/70",
    icon: AlertOctagon,
  },
  WARNING: {
    label: "Warning",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    row: "bg-amber-50/40 hover:bg-amber-50/70",
    icon: AlertTriangle,
  },
  INFO: {
    label: "Info",
    badge: "bg-sky-100 text-sky-800 border-sky-200",
    row: "bg-sky-50/40 hover:bg-sky-50/70",
    icon: Info,
  },
};

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export const AdminNotificationsTable = ({ notifications, onMarkRead, isUpdating }: AdminNotificationsTableProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (notifications.length === 0) {
    return (
      <div className="w-full rounded-[10px] border border-neutral-200 bg-white px-5 py-12 text-center text-sm text-neutral-500 shadow-xs">
        No notifications match the selected filter.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col overflow-clip rounded-[10px] border border-neutral-200 bg-white px-5 py-2 shadow-xs">
      {notifications.map((item) => {
        const style = SEVERITY_STYLE[item.severity];
        const Icon = style.icon;
        const isUnread = item.readAt === null;
        const isExpanded = expandedId === item.id;

        return (
          <div key={item.id} className="border-b border-neutral-100 last:border-b-0">
            <button
              type="button"
              aria-expanded={isExpanded}
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
              className={cn(
                "-mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-center gap-4 rounded-lg px-2 py-3.5 text-left transition-colors",
                isUnread ? style.row : "hover:bg-neutral-50/80",
              )}
            >
              <span
                className={cn(
                  "inline-flex w-24 shrink-0 items-center justify-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                  style.badge,
                )}
              >
                <Icon className="size-3" /> {style.label}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className={cn("truncate text-sm text-neutral-900", isUnread ? "font-semibold" : "font-medium")}>
                  {item.title}
                </p>
                <p className="truncate text-xs text-neutral-600">{item.message}</p>
              </div>
              <span className="w-40 shrink-0 text-xs text-neutral-500">{formatDateTime(item.createdAt)}</span>
              <ChevronDown
                className={cn("size-4 shrink-0 text-neutral-400 transition-transform", isExpanded && "rotate-180")}
              />
            </button>

            {isExpanded && (
              <div className="flex flex-col gap-3 pb-4 pl-28 pr-2">
                <p className="text-sm text-neutral-800">{item.message}</p>

                {item.details && (
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Reason</p>
                    <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-neutral-200 bg-neutral-50 p-3 font-mono text-xs text-neutral-800">
                      {item.details}
                    </pre>
                  </div>
                )}

                {item.metadata && Object.keys(item.metadata).length > 0 && (
                  <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-xs">
                    {Object.entries(item.metadata).map(([key, value]) => (
                      <div key={key} className="contents">
                        <dt className="text-neutral-500">{key}</dt>
                        <dd className="break-all font-mono text-neutral-800">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                <div className="flex items-center gap-2">
                  {item.metadata?.jobId && (
                    <Link
                      to={
                        item.metadata.submissionId
                          ? `/admin/content-moderation/jobs/${item.metadata.jobId}?submission=${item.metadata.submissionId}`
                          : `/admin/content-moderation/jobs/${item.metadata.jobId}`
                      }
                      className="inline-flex h-7 items-center rounded-md bg-neutral-900 px-2.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
                    >
                      {item.metadata.submissionId ? "Open submission" : "Open job"}
                    </Link>
                  )}
                  {isUnread && (
                    <AdminButton
                      variant="outline"
                      size="sm"
                      disabled={isUpdating}
                      onClick={() => onMarkRead(item)}
                      className="h-7 px-2.5 text-xs"
                    >
                      Mark as read
                    </AdminButton>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
