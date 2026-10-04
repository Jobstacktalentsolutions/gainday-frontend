import { useState, useMemo } from "react";
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
  ExternalLink,
  Eye,
  Trash2,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { AdminButton } from "@/components/ui/AdminButton";
import StatusBadge from "./StatusBadge";
import type { AdminJob } from "../types/job";

interface LiveJobPostsPanelProps {
  jobs: AdminJob[];
  onRemove: (job: AdminJob) => void;
  isRemoving: boolean;
}

const LiveJobPostsPanel = ({ jobs, onRemove, isRemoving }: LiveJobPostsPanelProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        (job.role && job.role.toLowerCase().includes(query)) ||
        (job.location && job.location.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "FLAGGED"
          ? (job.flaggedCount ?? 0) > 0
          : job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);

  const formatSalary = (job: AdminJob) => {
    if (!job.salaryRange || (!job.salaryRange.min && !job.salaryRange.max)) {
      return null;
    }
    const currency = job.salaryRange.currency || "USD";
    const symbol = currency === "NGN" ? "₦" : currency === "GBP" ? "£" : "$";
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
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search job posts by title, company, role, or location..."
            className="h-10 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "ALL", label: `All (${jobs.length})` },
            { id: "live", label: `Live (${jobs.filter((j) => j.status === "live").length})` },
            { id: "draft", label: `Draft (${jobs.filter((j) => j.status === "draft").length})` },
            { id: "closed", label: `Closed (${jobs.filter((j) => j.status === "closed").length})` },
            {
              id: "FLAGGED",
              label: `Flagged (${jobs.filter((j) => (j.flaggedCount ?? 0) > 0).length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-primary-600 text-white shadow-xs"
                  : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="w-full rounded-2xl border border-neutral-200 bg-white p-12 text-center text-xs text-neutral-500">
          No job posts match the selected criteria.
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {filteredJobs.map((job) => {
            const salary = formatSalary(job);
            const hasFlags = (job.flaggedCount ?? 0) > 0;

            return (
              <div
                key={job.id}
                onClick={() => navigate(`/admin/content-moderation/jobs/${job.id}`)}
                className="group relative flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs transition-all hover:border-primary-200 hover:shadow-md cursor-pointer"
              >
                {/* Header Row: Title, Company, Status, and CTAs */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-neutral-900 group-hover:text-primary-600 transition-colors truncate">
                        {job.title}
                      </h3>
                      <StatusBadge status={job.status} />
                      {hasFlags && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-error-50 text-error-700 border border-error-200">
                          <ShieldAlert className="size-3 text-error-600" />
                          {job.flaggedCount} Flagged
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1 font-medium text-neutral-700">
                        <Building2 className="size-3.5 text-neutral-400" />
                        {job.company}
                        {job.isEmployerVerified && (
                          <CheckCircle2 className="size-3 text-emerald-600 ml-0.5" />
                        )}
                      </span>

                      {job.location && (
                        <span className="flex items-center gap-1">
                          <span className="text-neutral-300">·</span>
                          <MapPin className="size-3.5 text-neutral-400" />
                          {job.location}
                          {job.isRemoteFriendly && (
                            <span className="text-[10px] font-medium text-primary-600 bg-primary-50 px-1.5 py-0.2 rounded">
                              Remote
                            </span>
                          )}
                        </span>
                      )}

                      {job.role && (
                        <span className="flex items-center gap-1">
                          <span className="text-neutral-300">·</span>
                          <Briefcase className="size-3.5 text-neutral-400" />
                          {job.role}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Top-Right Action Buttons */}
                  <div
                    className="flex shrink-0 items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <AdminButton
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/job-board/${job.id}`, "_blank");
                      }}
                      className="h-8 px-2.5 text-xs flex items-center gap-1 cursor-pointer bg-white text-neutral-700 hover:bg-neutral-50"
                      title="Public Job Board View"
                    >
                      <ExternalLink className="size-3" />
                      Preview
                    </AdminButton>

                    <AdminButton
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/content-moderation/jobs/${job.id}`);
                      }}
                      className="h-8 px-2.5 text-xs flex items-center gap-1 cursor-pointer text-primary-600 border-primary-200 hover:bg-primary-50"
                    >
                      <Eye className="size-3" />
                      Moderate
                    </AdminButton>

                    <AdminButton
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(job);
                      }}
                      disabled={isRemoving}
                      className="h-8 px-2.5 text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="size-3" />
                      Remove
                    </AdminButton>
                  </div>
                </div>

                {/* Badges / Context Row */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-100 text-xs">
                  {job.isSimulationReady ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                      <Zap className="size-3 text-purple-600" />
                      {job.simulationTaskCount} Simulation Tasks Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-600">
                      <Clock className="size-3 text-neutral-400" />
                      Simulation Pending
                    </span>
                  )}

                  {job.employmentType && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-700">
                      {job.employmentType}
                    </span>
                  )}

                  {salary && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <DollarSign className="size-3 text-emerald-600" />
                      {salary}
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
        </div>
      )}
    </div>
  );
};

export default LiveJobPostsPanel;