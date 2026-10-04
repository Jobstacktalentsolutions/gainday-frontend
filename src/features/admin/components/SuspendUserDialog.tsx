import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { AdminButton } from "@/components/ui/AdminButton";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { AdminAccount } from "../types/user";

interface SuspendUserDialogProps {
  user: AdminAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (user: AdminAccount, reason: string) => void;
  isPending: boolean;
}

const QUICK_REASONS = [
  "Violation of Terms of Service",
  "Anti-cheat or integrity violation",
  "Fraudulent or suspicious activity",
  "Spam or misleading job posting",
  "Account under administrative investigation",
];

const SuspendUserDialog = ({
  user,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: SuspendUserDialogProps) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open]);

  if (!user) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onConfirm(user, reason.trim() || "Violation of platform policies");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-xl sm:max-w-xl">
        <AlertDialogHeader>
          <div className="flex size-10 items-center justify-center rounded-full bg-error-50">
            <AlertTriangle className="size-5 text-error-500" strokeWidth={2} />
          </div>
          <AlertDialogTitle>Suspend {user.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            They'll lose access immediately and won't be able to sign in until
            reinstated. Please provide a reason for the record and for their
            suspension notice.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 py-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
            Suspension Reason <span className="text-error-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Repeated anti-cheat violation on assessment or suspicious behavior..."
            rows={3}
            required
            className="w-full rounded-lg border border-neutral-200 bg-white p-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-neutral-500">
              Quick templates:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_REASONS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setReason(preset)}
                  className={`rounded-md border px-2 py-1 text-[11px] transition-colors cursor-pointer text-left ${
                    reason === preset
                      ? "border-primary-500 bg-primary-50 font-medium text-primary-700"
                      : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <AlertDialogFooter className="mt-3">
            <AlertDialogCancel asChild>
              <AdminButton
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
              >
                Cancel
              </AdminButton>
            </AlertDialogCancel>
            <AdminButton
              type="submit"
              variant="destructive"
              size="sm"
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? "Suspending..." : "Confirm Suspension"}
            </AdminButton>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SuspendUserDialog;
