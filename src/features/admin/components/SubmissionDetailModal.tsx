import { CheckCircle2, AlertTriangle, Clock, Calendar, Building2, Briefcase, Award, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { CandidateSubmission } from "../types/candidateDetail";

interface SubmissionDetailModalProps {
  submission: CandidateSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubmissionDetailModal = ({
  submission,
  open,
  onOpenChange,
}: SubmissionDetailModalProps) => {
  if (!submission) return null;

  const formatDuration = (seconds?: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreBadge = (score: number | null) => {
    if (score === null) return <span className="text-xs text-neutral-400 font-medium">Pending grading</span>;
    if (score >= 80) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Award className="size-3.5 text-emerald-600" /> {score}% (Exemplary)
        </span>
      );
    }
    if (score >= 60) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Award className="size-3.5 text-blue-600" /> {score}% (Proficient)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Award className="size-3.5 text-amber-600" /> {score}% (Needs Review)
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-lg font-bold text-neutral-900">
                Assessment Submission Details
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-500 mt-1">
                Submission ID: <span className="font-mono">{submission.id}</span>
              </DialogDescription>
            </div>
            <div>{getScoreBadge(submission.overallScore)}</div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-5 pt-3">
          {/* Job & Simulation Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 text-xs">
            <div>
              <span className="text-neutral-500 flex items-center gap-1">
                <Briefcase className="size-3 text-neutral-400" /> Job Title
              </span>
              <p className="font-semibold text-neutral-900 mt-0.5 truncate">{submission.jobTitle}</p>
            </div>
            <div>
              <span className="text-neutral-500 flex items-center gap-1">
                <Building2 className="size-3 text-neutral-400" /> Company
              </span>
              <p className="font-semibold text-neutral-900 mt-0.5 truncate">{submission.companyName}</p>
            </div>
            <div>
              <span className="text-neutral-500 flex items-center gap-1">
                <Clock className="size-3 text-neutral-400" /> Time Taken
              </span>
              <p className="font-semibold text-neutral-900 mt-0.5">{formatDuration(submission.timeTakenSeconds)}</p>
            </div>
            <div>
              <span className="text-neutral-500 flex items-center gap-1">
                <Calendar className="size-3 text-neutral-400" /> Submitted
              </span>
              <p className="font-semibold text-neutral-900 mt-0.5">
                {submission.completedAt
                  ? new Date(submission.completedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "In Progress"}
              </p>
            </div>
          </div>

          {/* Anti-cheat Proctoring Status */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                {submission.isAntiCheatFlagged ? (
                  <ShieldAlert className="size-4 text-error-600" />
                ) : (
                  <ShieldCheck className="size-4 text-emerald-600" />
                )}
                <p className="text-sm font-semibold text-neutral-900">
                  Proctoring & Integrity Check
                </p>
              </div>
              {submission.isAntiCheatFlagged ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-error-700 bg-error-50 border border-error-200 px-2.5 py-0.5 rounded-full">
                  <AlertTriangle className="size-3 text-error-600" /> Proctor Flags Detected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="size-3 text-emerald-600" /> Verified Integrity
                </span>
              )}
            </div>

            {submission.antiCheatFlags && submission.antiCheatFlags.length > 0 ? (
              <div className="mt-3 flex flex-col gap-2">
                <p className="text-xs font-medium text-neutral-500">Flagged Events Log:</p>
                <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {submission.antiCheatFlags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg bg-error-50/50 border border-error-100 px-3 py-1.5 text-xs text-error-800"
                    >
                      <span className="font-mono font-medium">{flag.type}</span>
                      <span className="text-[11px] text-neutral-500">
                        {new Date(flag.occurredAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-2 text-xs text-neutral-500">
                No focus loss, tab switching, or suspicious background events occurred during this simulation.
              </p>
            )}
          </div>

          {/* Category Scores Breakdown */}
          {submission.categoryScores && (
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-sm font-semibold text-neutral-900 mb-3">
                Core Competency Evaluation
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(submission.categoryScores).map(([key, cat]) => {
                  if (!cat) return null;
                  const label = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());
                  const scoreOutOfTen = cat.score ?? 0;
                  const percentage = Math.round((scoreOutOfTen / 10) * 100);

                  return (
                    <div
                      key={key}
                      className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-3 flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-neutral-700">{label}</span>
                        <span className="font-bold text-neutral-900">{scoreOutOfTen} / 10</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            percentage >= 80
                              ? "bg-emerald-500"
                              : percentage >= 60
                              ? "bg-primary-500"
                              : "bg-amber-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {cat.rationale && (
                        <p className="text-[11px] text-neutral-600 mt-1 line-clamp-2">
                          {cat.rationale}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Task-by-task Grading Breakdown */}
          {submission.taskScores && submission.taskScores.length > 0 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-sm font-semibold text-neutral-900 mb-3">
                Task Performance Breakdown ({submission.taskScores.length} Tasks)
              </p>
              <div className="flex flex-col gap-3">
                {submission.taskScores.map((task, idx) => (
                  <div
                    key={task.taskId || idx}
                    className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3.5 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900">
                        Task #{idx + 1}
                      </span>
                    </div>
                    {task.summary && (
                      <p className="text-xs text-neutral-700 bg-white p-2.5 rounded border border-neutral-200">
                        {task.summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionDetailModal;
