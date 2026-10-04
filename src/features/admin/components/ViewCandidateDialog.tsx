import { Phone, FileCheck, Calendar, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import StatusBadge from "./StatusBadge";
import type { AdminCandidate } from "../types/user";

interface ViewCandidateDialogProps {
  candidate: AdminCandidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuspend?: (candidate: AdminCandidate) => void;
}

export const ViewCandidateDialog = ({
  candidate,
  open,
  onOpenChange,
  onSuspend,
}: ViewCandidateDialogProps) => {
  if (!candidate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Candidate Details</DialogTitle>
          <DialogDescription>{candidate.email}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-3">
          {/* Suspension Banner */}
          {(candidate.status === "suspended" || candidate.isActive === false) && (
            <div className="flex items-start gap-3 rounded-lg border border-error-200 bg-error-50 p-3.5 text-xs text-error-900 shadow-xs">
              <AlertTriangle className="size-4 shrink-0 text-error-600 mt-0.5" />
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-error-900">
                    Candidate Suspended
                  </span>
                  {candidate.suspendedAt && (
                    <span className="text-[11px] text-error-700">
                      {new Date(candidate.suspendedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
                <p className="text-error-800">
                  <span className="font-medium">Reason: </span>
                  {candidate.suspensionReason || "Platform policy violation"}
                </p>
              </div>
            </div>
          )}

          {/* Profile Overview Card */}
          <div className="rounded-lg border border-neutral-100 bg-neutral-50/60 p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700 font-semibold text-sm border border-primary-200">
                {candidate.name
                  ? candidate.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "CD"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-neutral-900 truncate">{candidate.name}</p>
                <p className="text-xs text-neutral-500 truncate">{candidate.email}</p>
              </div>
              <StatusBadge status={candidate.status} />
            </div>
          </div>

          {/* Details Grid */}
          <div className="rounded-lg border border-neutral-100 bg-neutral-50/60 p-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-neutral-500 flex items-center gap-1">
                <Phone className="size-3 text-neutral-400" /> Phone
              </span>
              <p className="font-medium text-neutral-900 mt-0.5">
                {candidate.candidateProfile?.phoneNumber || "Not provided"}
              </p>
            </div>

            <div>
              <span className="text-xs text-neutral-500 flex items-center gap-1">
                <FileCheck className="size-3 text-neutral-400" /> Submissions
              </span>
              <p className="font-medium text-neutral-900 mt-0.5">
                {candidate.candidateProfile?.submissionsCount ?? 0} assessments
              </p>
            </div>

            <div>
              <span className="text-xs text-neutral-500 flex items-center gap-1">
                <ShieldCheck className="size-3 text-neutral-400" /> Account Type
              </span>
              <p className="font-medium text-neutral-900 mt-0.5">Job Seeker</p>
            </div>

            <div>
              <span className="text-xs text-neutral-500 flex items-center gap-1">
                <Calendar className="size-3 text-neutral-400" /> Joined
              </span>
              <p className="font-medium text-neutral-900 mt-0.5">
                {candidate.createdAt
                  ? new Date(candidate.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Recent"}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          {onSuspend && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onSuspend(candidate);
              }}
            >
              Suspend Candidate
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCandidateDialog;
