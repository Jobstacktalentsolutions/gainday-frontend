import { useState } from "react";
import {
  Mail,
  Copy,
  Check,
  Calendar,
  Send,
  ExternalLink,
  CheckCircle2,
  Clock,
  Eye,
  RotateCcw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AdminButton } from "@/components/ui/AdminButton";
import {
  useUpdateSupportStatus,
  useReplySupportMessage,
} from "../hooks/useSupportMessages";
import type { SupportMessage } from "../types/support";

interface ViewSupportMessageDialogProps {
  message: SupportMessage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewSupportMessageDialog = ({
  message,
  open,
  onOpenChange,
}: ViewSupportMessageDialogProps) => {
  const [copied, setCopied] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState("resolved");
  const [replySuccessMessage, setReplySuccessMessage] = useState<string | null>(null);

  const updateStatusMutation = useUpdateSupportStatus();
  const replyMutation = useReplySupportMessage();

  if (!message) return null;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(message.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleStatusChange = (newStatus: string) => {
    updateStatusMutation.mutate(
      { id: message.id, status: newStatus },
      {
        onSuccess: () => {
          setReplySuccessMessage(`Status updated to ${newStatus}`);
          setTimeout(() => setReplySuccessMessage(null), 3000);
        },
      }
    );
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || replyText.trim().length < 5) return;

    replyMutation.mutate(
      {
        id: message.id,
        payload: {
          replyMessage: replyText.trim(),
          markStatus: replyStatus,
        },
      },
      {
        onSuccess: (data) => {
          setReplyText("");
          setReplySuccessMessage(data.message || "Reply sent successfully!");
          setTimeout(() => setReplySuccessMessage(null), 4000);
        },
      }
    );
  };

  const mailtoSubject = encodeURIComponent(`Re: [${message.topic}] Gainday Support Inquiry`);
  const mailtoBody = encodeURIComponent(
    `Hello ${message.name},\n\nThank you for reaching out to Gainday Support regarding "${message.topic}".\n\n[Your response here]\n\n---\nOriginal message:\n${message.message}\n`
  );
  const mailtoHref = `mailto:${message.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="size-3" /> Unread / Pending
          </span>
        );
      case "read":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
            <Eye className="size-3" /> Read
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <RotateCcw className="size-3" /> In Progress
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="size-3" /> Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200">
            {status}
          </span>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3 pr-6">
            <DialogTitle className="text-lg font-bold text-neutral-900">
              Support Inquiry Details
            </DialogTitle>
            {renderStatusBadge(message.status)}
          </div>
          <DialogDescription className="text-xs text-neutral-500">
            Ticket ID: {message.id}
          </DialogDescription>
        </DialogHeader>

        {replySuccessMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-800">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
            <span>{replySuccessMessage}</span>
          </div>
        )}

        {/* Sender Info & Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-lg border border-neutral-200 bg-neutral-50/70 p-3.5 text-xs">
          <div>
            <span className="text-neutral-500 font-medium">Sender Name:</span>
            <p className="font-semibold text-neutral-900 mt-0.5">{message.name}</p>
          </div>
          <div>
            <span className="text-neutral-500 font-medium">Email Address:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-semibold text-neutral-900">{message.email}</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer"
                title="Copy Email"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <span className="text-neutral-500 font-medium">Inquiry Topic:</span>
            <p className="font-semibold text-primary-700 mt-0.5">{message.topic}</p>
          </div>
          <div>
            <span className="text-neutral-500 font-medium">Date Received:</span>
            <p className="text-neutral-700 mt-0.5 flex items-center gap-1.5">
              <Calendar className="size-3.5 text-neutral-400" />
              {new Date(message.createdAt).toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Inquiry Message Box */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
            Inquiry Message
          </label>
          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-900 leading-relaxed whitespace-pre-wrap">
            {message.message}
          </div>
        </div>

        {/* Status Actions */}
        <div className="flex flex-col gap-2 pt-1 border-t border-neutral-100">
          <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
            Manage Status
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {message.status !== "pending" && (
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("pending")}
                disabled={updateStatusMutation.isPending}
                className="text-xs"
              >
                <Clock className="size-3.5" /> Mark as Unread / Pending
              </AdminButton>
            )}

            {message.status !== "read" && (
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("read")}
                disabled={updateStatusMutation.isPending}
                className="text-xs"
              >
                <Eye className="size-3.5" /> Mark as Read
              </AdminButton>
            )}

            {message.status !== "in_progress" && (
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("in_progress")}
                disabled={updateStatusMutation.isPending}
                className="text-xs"
              >
                <RotateCcw className="size-3.5" /> Mark In Progress
              </AdminButton>
            )}

            {message.status !== "resolved" && (
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("resolved")}
                disabled={updateStatusMutation.isPending}
                className="text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50"
              >
                <CheckCircle2 className="size-3.5 text-emerald-600" /> Mark Resolved
              </AdminButton>
            )}
          </div>
        </div>

        {/* Follow Up & Connect with Individual */}
        <div className="flex flex-col gap-3 pt-3 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
              <Mail className="size-4 text-primary-600" />
              Follow Up with {message.name}
            </h4>

            {/* Quick External Mail Client Link */}
            <a
              href={mailtoHref}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="size-3" />
              Open in Native Email Client
            </a>
          </div>

          {/* In-App Direct Response Form */}
          <form onSubmit={handleSendReply} className="flex flex-col gap-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Write a direct response to ${message.name} (${message.email})...`}
              rows={4}
              className="w-full rounded-lg border border-neutral-200 p-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-500">After sending, set status:</span>
                <select
                  value={replyStatus}
                  onChange={(e) => setReplyStatus(e.target.value)}
                  className="rounded border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-800 focus:outline-none"
                >
                  <option value="resolved">Resolved</option>
                  <option value="in_progress">In Progress</option>
                  <option value="read">Read</option>
                </select>
              </div>

              <AdminButton
                type="submit"
                size="sm"
                disabled={
                  replyMutation.isPending ||
                  !replyText.trim() ||
                  replyText.trim().length < 5
                }
                className="gap-1.5"
              >
                <Send className="size-3.5" />
                {replyMutation.isPending ? "Sending Reply..." : "Send Email Reply"}
              </AdminButton>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
