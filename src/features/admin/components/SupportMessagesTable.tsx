import { Eye, Clock, CheckCircle2, RotateCcw } from "lucide-react";
import { AdminButton } from "@/components/ui/AdminButton";
import type { SupportMessage } from "../types/support";
import { cn } from "@/lib/utils";

interface SupportMessagesTableProps {
  messages: SupportMessage[];
  onView: (message: SupportMessage) => void;
  onToggleRead: (message: SupportMessage) => void;
  isUpdatingStatus: boolean;
}

const renderStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <Clock className="size-3" /> Unread / Pending
        </span>
      );
    case "read":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
          <Eye className="size-3" /> Read
        </span>
      );
    case "in_progress":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">
          <RotateCcw className="size-3" /> In Progress
        </span>
      );
    case "resolved":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="size-3" /> Resolved
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200">
          {status}
        </span>
      );
  }
};

const getTopicColor = (topic: string) => {
  const t = topic.toLowerCase();
  if (t.includes("suspension") || t.includes("appeal")) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  if (t.includes("bug") || t.includes("technical")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (t.includes("billing") || t.includes("subscription")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (t.includes("access") || t.includes("login")) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }
  return "bg-neutral-100 text-neutral-700 border-neutral-200";
};

export const SupportMessagesTable = ({
  messages,
  onView,
  onToggleRead,
  isUpdatingStatus,
}: SupportMessagesTableProps) => {
  if (messages.length === 0) {
    return (
      <div className="w-full rounded-[10px] border border-neutral-200 bg-white px-5 py-12 text-center text-sm text-neutral-500 shadow-xs">
        No support inquiries found matching the selected filter.
      </div>
    );
  }

  return (
    <div
      role="table"
      aria-label="Support Inquiries"
      className="flex w-full flex-col overflow-clip rounded-[10px] border border-neutral-200 bg-white px-5 py-2 shadow-xs"
    >
      {/* Table Header */}
      <div
        role="row"
        className="flex w-full items-center gap-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 border-b border-neutral-100"
      >
        <span role="columnheader" className="w-56 shrink-0">
          Sender / Contact
        </span>
        <span role="columnheader" className="w-48 shrink-0">
          Topic
        </span>
        <span role="columnheader" className="min-w-0 flex-1">
          Message Excerpt
        </span>
        <span role="columnheader" className="w-32 shrink-0">
          Date
        </span>
        <span role="columnheader" className="w-32 shrink-0">
          Status
        </span>
        <span role="columnheader" className="w-32 shrink-0 text-right">
          Actions
        </span>
      </div>

      {/* Table Rows */}
      {messages.map((item) => {
        const isUnread = item.status === "pending";

        return (
          <div
            key={item.id}
            role="row"
            onClick={() => onView(item)}
            className={cn(
              "flex w-full items-center gap-4 border-b border-neutral-100 last:border-b-0 py-3.5 px-2 -mx-2 rounded-lg cursor-pointer transition-colors",
              isUnread
                ? "bg-amber-50/40 hover:bg-amber-50/70 font-medium"
                : "hover:bg-neutral-50/80"
            )}
          >
            {/* Sender Column */}
            <div role="cell" className="flex w-56 shrink-0 flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                {isUnread && (
                  <span
                    className="size-2 rounded-full bg-amber-500 shrink-0"
                    title="Unread Inquiry"
                  />
                )}
                <p className="truncate text-sm font-semibold text-neutral-900">
                  {item.name}
                </p>
              </div>
              <p className="truncate text-xs text-neutral-500">{item.email}</p>
            </div>

            {/* Topic Column */}
            <div role="cell" className="w-48 shrink-0">
              <span
                className={cn(
                  "inline-block max-w-full truncate rounded-md border px-2 py-0.5 text-xs font-medium",
                  getTopicColor(item.topic)
                )}
                title={item.topic}
              >
                {item.topic}
              </span>
            </div>

            {/* Message Excerpt Column */}
            <div role="cell" className="min-w-0 flex-1">
              <p className="truncate text-xs text-neutral-600">
                {item.message}
              </p>
            </div>

            {/* Date Column */}
            <div role="cell" className="w-32 shrink-0 text-xs text-neutral-500">
              {new Date(item.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>

            {/* Status Column */}
            <div role="cell" className="w-32 shrink-0">
              {renderStatusBadge(item.status)}
            </div>

            {/* Actions Column */}
            <div
              role="cell"
              className="flex w-32 shrink-0 items-center justify-end gap-1.5 text-right"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => onToggleRead(item)}
                disabled={isUpdatingStatus}
                title={isUnread ? "Mark as Read" : "Mark as Unread"}
                className="p-1.5 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                {isUnread ? (
                  <Eye className="size-4 text-sky-600" />
                ) : (
                  <Clock className="size-4 text-amber-600" />
                )}
              </button>

              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => onView(item)}
                className="h-7 px-2.5 text-xs"
              >
                Details
              </AdminButton>
            </div>
          </div>
        );
      })}
    </div>
  );
};
