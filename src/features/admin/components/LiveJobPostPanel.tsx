import { useNavigate } from "react-router-dom";
import {
  Search,
  Building2,
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  Users,
  Award,
  Zap,
  ShieldAlert,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { AdminButton } from "@/components/ui/AdminButton";
import StatusBadge from "./StatusBadge";
import { TableLoadMore } from "./TableLoadMore";
import type { AdminJob } from "../types/job";

interface LiveJobPostsPanelProps {
  jobs: AdminJob[];
  totalCount: number;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  onLoadMore: () => void;
  onRemove: (job: AdminJob) => void;
  isRemoving: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

const LiveJobPostsPanel = ({
  jobs,
  totalCount,
  hasNextPage = false,
  isLoadingMore = false,
  onLoadMore,
  onRemove,
  isRemoving,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: LiveJobPostsPanelProps) => {
  const navigate = useNavigate();

  const formatSalary = (job: AdminJob) => {
    if (!job.salaryRange || (!job.salaryRange.min && !job.salaryRange.max)) {
      return null;
    }
    const currency = job.salaryRange.currency === "USD" || !job.salaryRange.currency ? "GBP" : job.salaryRange.currency;
    const symbol = currency === "NGN" ? "₦" : currency === "GBP" || currency === "USD" ? "£" : currency;
    const min = job.salaryRange.min ? `${symbol}${job.salaryRange.min.toLocaleString()}` : null;
    const max = job.salaryRange.max ? `${symbol}${job.salaryRange.max.toLocaleString()}` : null;

    if (min && max) return `${min} - ${max}`;
    if (min) return `From ${min}`;
    return `Up to ${max}`;
  };

  return (
    <div className="flex w-full flex-col gap-5">
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search job posts by title, role..."
            className="h-10 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "ALL", label: "All Posts" },
            { id: "live", label: "Live" },
            { id: "draft", label: "Draft" },
            { id: "closed", label: "Closed" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusFilterChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-primary-600 text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List / Table */}
      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center shadow-xs">
          <Briefcase className="size-10 text-neutral-300 mb-3" />
          <p className="text-sm font-semibold text-neutral-800">No job postings found</p>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm">
            {searchTerm || statusFilter !== "ALL"
              ? "Try adjusting your search terms or filter criteria."
              : "No employers have created job posts yet."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {jobs.map((job) => {
            const hasFlags = (job.flaggedCount ?? 0) > 0;
            const salary = formatSalary(job);

            return (
              <div
                key={job.id}
                onClick={() => navigate(`/admin/content-moderation/jobs/${job.id}`)}
                className={`group flex flex-col gap-3.5 rounded-2xl border bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-primary-300 cursor-pointer ${
                  hasFlags
                    ? "border-error-200 bg-gradient-to-r from-white via-white to-error-50/20"
                    : "border-neutral-200"
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3.5">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 border border-primary-100 group-hover:bg-primary-100 transition-colors">
                      <Building2 className="size-5" />
                    </div>

                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-base font-bold text-neutral-900 group-hover:text-primary-700 transition-colors">
                          {job.title}
                        </h2>
                        <StatusBadge status={job.status} />
                        {hasFlags && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-error-50 border border-error-200 px-2 py-0.5 text-[10px] font-bold text-error-700">
                            <ShieldAlert className="size-3 text-error-600" />
                            {job.flaggedCount} Flagged Submissions
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-neutral-500 flex-wrap">
                        <span className="font-semibold text-neutral-800 flex items-center gap-1">
                          {job.company}
                          {job.isEmployerVerified && (
                            <span title="Verified Employer" className="inline-flex items-center">
                              <CheckCircle2 className="size-3.5 text-emerald-600" />
                            </span>
                          )}
                        </span>
                        {job.location && (
                          <span className="flex items-center gap-1 text-neutral-500">
                            <MapPin className="size-3 text-neutral-400" />
                            {job.location} {job.isRemoteFriendly ? "(Remote)" : ""}
                          </span>
                        )}
                        {job.employmentType && (
                          <span className="flex items-center gap-1 text-neutral-500">
                            <Clock className="size-3 text-neutral-400" />
                            {job.employmentType}
                          </span>
                        )}
                        {salary && (
                          <span className="flex items-center gap-0.5 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            {salary}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div
                    className="flex items-center gap-2 self-end sm:self-auto shrink-0 pt-2 sm:pt-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <AdminButton
                      variant="destructive"
                      size="sm"
                      disabled={isRemoving}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(job);
                      }}
                      className="inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="size-3.5" /> Remove
                    </AdminButton>
                  </div>
                </div>

                {/* Simulation & Skill Pills */}
                <div className="flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-3">
                  {job.isSimulationReady ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 border border-purple-200 px-2 py-1 text-[11px] font-semibold text-purple-700">
                      <Zap className="size-3 text-purple-600" />
                      Simulation Ready ({job.simulationTaskCount} Tasks)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-1 text-[11px] font-semibold text-amber-700">
                      <Clock className="size-3 text-amber-600" />
                      Simulation Pending
                    </span>
                  )}

                  {job.role && (
                    <span className="rounded bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-700">
                      Role: {job.role}
                    </span>
                  )}
                  {job.skillLevel && (
                    <span className="rounded bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-700">
                      Level: {job.skillLevel}
                    </span>
                  )}

                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div className="flex items-center gap-1">
                      {job.requiredSkills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills.length > 3 && (
                        <span className="text-[10px] text-neutral-400">
                          +{job.requiredSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Metrics Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs text-neutral-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-neutral-700 font-semibold">
                      <Users className="size-3.5 text-neutral-400" />
                      {job.applicantCount} total applicants
                    </span>

                    {job.averageScore !== null && (
                      <span className="flex items-center gap-1 text-neutral-700 font-semibold">
                        <Award className="size-3.5 text-emerald-600" />
                        {job.averageScore}% avg score ({job.scoredApplicantCount ?? 0} scored)
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-1 text-neutral-400 text-[11px]">
                    <Calendar className="size-3 text-neutral-400" />
                    Posted{" "}
                    {new Date(job.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            );
          })}

          <TableLoadMore
            currentCount={jobs.length}
            totalCount={totalCount}
            hasNextPage={hasNextPage}
            isLoading={isLoadingMore}
            onLoadMore={onLoadMore}
          />
        </div>
      )}
    </div>
  );
};

export default LiveJobPostsPanel;