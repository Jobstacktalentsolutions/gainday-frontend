import { useState, useMemo } from "react";
import { Search, Eye, Award, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminButton } from "@/components/ui/AdminButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { CandidateSubmission } from "../types/candidateDetail";

interface AllSubmissionsModalProps {
  submissions: CandidateSubmission[];
  candidateName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectSubmission: (submission: CandidateSubmission) => void;
}

export const AllSubmissionsModal = ({
  submissions,
  candidateName,
  open,
  onOpenChange,
  onSelectSubmission,
}: AllSubmissionsModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchesSearch =
        sub.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.companyName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchTerm, statusFilter]);

  const formatDuration = (seconds?: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-5xl sm:max-w-5xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-neutral-900">
            All Assessment Submissions
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500">
            Complete assessment records & simulation attempts for {candidateName}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-3">
          {/* Controls: Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by job title or company..."
                className="h-9 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              {["ALL", "SCORED", "SCORING", "PENDING"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    statusFilter === status
                      ? "bg-primary-600 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Submissions Table / List */}
          {filteredSubmissions.length === 0 ? (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-8 text-center text-xs text-neutral-500">
              No submissions found matching your search criteria.
            </div>
          ) : (
            <div className="flex flex-col rounded-xl border border-neutral-200 overflow-hidden">
              <div className="flex items-center gap-3 bg-neutral-50 px-4 py-2.5 text-xs font-semibold text-neutral-500 border-b border-neutral-200">
                <span className="flex-1">ROLE / COMPANY</span>
                <span className="w-24 text-center">SCORE</span>
                <span className="w-24 text-center">DURATION</span>
                <span className="w-28 text-center">INTEGRITY</span>
                <span className="w-24 text-right">ACTION</span>
              </div>

              {filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/70 transition-colors text-xs"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 truncate">{sub.jobTitle}</p>
                    <p className="text-neutral-500 text-[11px] truncate">{sub.companyName}</p>
                  </div>

                  <div className="w-24 text-center">
                    {sub.overallScore !== null ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Award className="size-3 text-emerald-600" /> {sub.overallScore}%
                      </span>
                    ) : (
                      <span className="text-neutral-400 font-medium">{sub.status}</span>
                    )}
                  </div>

                  <div className="w-24 text-center text-neutral-600 flex items-center justify-center gap-1">
                    <Clock className="size-3 text-neutral-400" />
                    <span>{formatDuration(sub.timeTakenSeconds)}</span>
                  </div>

                  <div className="w-28 text-center">
                    {sub.isAntiCheatFlagged ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-error-50 text-error-700 border border-error-200">
                        <AlertTriangle className="size-3 text-error-600" /> Flagged
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="size-3 text-emerald-600" /> Clear
                      </span>
                    )}
                  </div>

                  <div className="w-24 text-right">
                    <AdminButton
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectSubmission(sub)}
                      className="h-7 px-2 text-xs flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <Eye className="size-3" /> View
                    </AdminButton>
                  </div>
                </div>
              ))}
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

export default AllSubmissionsModal;
