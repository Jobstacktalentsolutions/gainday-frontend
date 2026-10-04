import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  Users,
  Award,
  ShieldAlert,
  ShieldCheck,
  Zap,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BrainCircuit,
  Eye,
  ChevronDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { AdminButton } from "@/components/ui/AdminButton";
import RemoveJobPostDialog from "../components/RemoveJobPostDialog";
import { SubmissionDetailModal } from "../components/SubmissionDetailModal";
import { TableLoadMore } from "../components/TableLoadMore";
import { useJobDetail } from "../hooks/useJobDetail";
import { useRemoveJobPost, useUpdateJobStatus } from "../hooks/useAdminJobs";
import type { CandidateSubmission } from "../types/candidateDetail";
import { JobDetailSkeleton } from "../components/skeletons";

const JobModerationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSubmission, setSelectedSubmission] = useState<CandidateSubmission | null>(null);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [visibleApplicationsCount, setVisibleApplicationsCount] = useState(10);

  const toggleTask = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleExpandAllTasks = () => {
    if (!simulation?.tasks) return;
    const allExpanded = simulation.tasks.every((t, i) => expandedTasks[t.id || String(i)]);
    if (allExpanded) {
      setExpandedTasks({});
    } else {
      const next: Record<string, boolean> = {};
      simulation.tasks.forEach((t, i) => {
        next[t.id || String(i)] = true;
      });
      setExpandedTasks(next);
    }
  };

  const { data: job, isLoading, isError, refetch } = useJobDetail(id);
  const removeJobMutation = useRemoveJobPost();
  const updateStatusMutation = useUpdateJobStatus();

  const handleConfirmRemove = () => {
    if (!job) return;
    removeJobMutation.mutate(job.id, {
      onSuccess: () => {
        toast.success("Job post removed successfully");
        navigate("/admin/content-moderation");
      },
    });
  };

  const handleToggleStatus = (newStatus: string) => {
    if (!job) return;
    updateStatusMutation.mutate(
      { jobId: job.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Job status updated to ${newStatus}`);
          refetch();
        },
      }
    );
  };

  if (isLoading) {
    return <JobDetailSkeleton />;
  }

  if (isError || !job) {
    return (
      <div className="flex w-full flex-col gap-6">
        <button
          type="button"
          onClick={() => navigate("/admin/content-moderation")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors w-fit cursor-pointer"
        >
          <ArrowLeft className="size-4" /> Back to Content Moderation
        </button>
        <div className="w-full rounded-2xl border border-error-200 bg-error-50 p-12 text-center text-sm text-error-700">
          Job post not found or has been removed.
        </div>
      </div>
    );
  }

  const { employer, simulation, stats, submissions } = job;

  const formatSalary = () => {
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

  const salaryString = formatSalary();

  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/admin/content-moderation")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" /> Back to Content Moderation
        </button>
      </div>

      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold text-neutral-900">{job.title}</h1>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  job.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : job.status === "DRAFT"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                }`}
              >
                {job.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600">
              <span className="flex items-center gap-1 font-medium text-neutral-800">
                <Building2 className="size-3.5 text-neutral-400" />
                {employer.companyName}
                {employer.isVerified && (
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
                      Remote friendly
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

              {job.employmentType && (
                <span className="flex items-center gap-1">
                  <span className="text-neutral-300">·</span>
                  <Clock className="size-3.5 text-neutral-400" />
                  {job.employmentType}
                </span>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <AdminButton
              variant="outline"
              size="sm"
              onClick={() => window.open(`/job-board/${job.id}`, "_blank")}
              className="flex items-center gap-1.5 cursor-pointer bg-white text-neutral-700 hover:bg-neutral-50"
            >
              <ExternalLink className="size-3.5" />
              Public View
            </AdminButton>

            {job.status === "ACTIVE" ? (
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => handleToggleStatus("INACTIVE")}
                disabled={updateStatusMutation.isPending}
                className="cursor-pointer text-amber-600 border-amber-200 hover:bg-amber-50"
              >
                Close Job
              </AdminButton>
            ) : (
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => handleToggleStatus("ACTIVE")}
                disabled={updateStatusMutation.isPending}
                className="cursor-pointer text-emerald-600 border-emerald-200 hover:bg-emerald-50"
              >
                Activate Job
              </AdminButton>
            )}

            <AdminButton
              variant="destructive"
              size="sm"
              onClick={() => setRemoveDialogOpen(true)}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              Remove Post
            </AdminButton>
          </div>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Total Applicants */}
        <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Applicants
            </span>
            <Users className="size-4 text-primary-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-1">
            {stats.totalApplicants}
          </p>
          <p className="text-[11px] text-neutral-500">Total job candidates</p>
        </div>

        {/* Completed Assessments */}
        <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Completed
            </span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-1">
            {stats.scoredApplicants}
          </p>
          <p className="text-[11px] text-neutral-500">Graded simulations</p>
        </div>

        {/* Average Score */}
        <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Avg Score
            </span>
            <Award className="size-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-1">
            {stats.averageScore !== null ? `${stats.averageScore}%` : "N/A"}
          </p>
          <p className="text-[11px] text-neutral-500">Applicant performance average</p>
        </div>

        {/* Proctoring Flags */}
        <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Proctor Flags
            </span>
            {stats.flaggedApplicants === 0 ? (
              <ShieldCheck className="size-4 text-emerald-600" />
            ) : (
              <ShieldAlert className="size-4 text-error-600" />
            )}
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-1">
            {stats.flaggedApplicants}
          </p>
          <p className="text-[11px] text-neutral-500">
            {stats.flaggedApplicants === 0 ? "Zero flagged submissions" : "Integrity alerts recorded"}
          </p>
        </div>
      </div>

      {/* Main Sections: Left is Job Details & Employer, Right is Simulation Tasks & Submissions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Job Description, Problem, Employer */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Business Problem Statement */}
          {job.businessProblem && (
            <div className="flex flex-col rounded-2xl border border-purple-200 bg-purple-50/50 p-5 shadow-xs">
              <h2 className="text-sm font-bold text-purple-900 mb-2 flex items-center gap-1.5">
                <BrainCircuit className="size-4 text-purple-600" />
                Target Business Challenge
              </h2>
              <p className="text-xs text-purple-800 leading-relaxed whitespace-pre-wrap">
                {job.businessProblem}
              </p>
            </div>
          )}

          {/* Job Overview */}
          <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
            <h2 className="text-sm font-bold text-neutral-900 mb-3.5 flex items-center gap-2">
              <FileText className="size-4 text-primary-600" />
              Role Specification
            </h2>

            <div className="flex flex-col gap-3 text-xs">
              {salaryString && (
                <div className="rounded-lg bg-neutral-50/70 border border-neutral-100 p-3">
                  <span className="text-neutral-500 font-medium">Compensation</span>
                  <p className="text-neutral-900 font-bold text-sm mt-0.5">{salaryString}</p>
                </div>
              )}

              {job.skillCategory && (
                <div className="rounded-lg bg-neutral-50/70 border border-neutral-100 p-3">
                  <span className="text-neutral-500 font-medium">Domain Category</span>
                  <p className="text-neutral-900 font-semibold mt-0.5">{job.skillCategory}</p>
                </div>
              )}

              {job.skillLevel && (
                <div className="rounded-lg bg-neutral-50/70 border border-neutral-100 p-3">
                  <span className="text-neutral-500 font-medium">Seniority Level</span>
                  <p className="text-neutral-900 font-semibold mt-0.5">{job.skillLevel}</p>
                </div>
              )}

              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <div className="rounded-lg bg-neutral-50/70 border border-neutral-100 p-3">
                  <span className="text-neutral-500 font-medium">Required Skills</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {job.requiredSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-white border border-neutral-200 px-2 py-0.5 text-[11px] font-medium text-neutral-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {job.applicationDeadline && (
                <div className="rounded-lg bg-neutral-50/70 border border-neutral-100 p-3">
                  <span className="text-neutral-500 font-medium flex items-center gap-1">
                    <Calendar className="size-3 text-neutral-400" /> Deadline
                  </span>
                  <p className="text-neutral-900 font-semibold mt-0.5">
                    {new Date(job.applicationDeadline).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Employer Info */}
          <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
            <h2 className="text-sm font-bold text-neutral-900 mb-3.5 flex items-center gap-2">
              <Building2 className="size-4 text-primary-600" />
              Employer Information
            </h2>

            <div className="flex flex-col gap-3 text-xs">
              <div className="rounded-lg bg-neutral-50/70 border border-neutral-100 p-3">
                <span className="text-neutral-500 font-medium">Company Name</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-neutral-900 font-semibold">{employer.companyName}</p>
                  {employer.isVerified && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {employer.email && (
                <div className="rounded-lg bg-neutral-50/70 border border-neutral-100 p-3">
                  <span className="text-neutral-500 font-medium">Contact Email</span>
                  <p className="text-neutral-900 font-semibold mt-0.5">{employer.email}</p>
                </div>
              )}

              {job.companyDescription && (
                <div className="rounded-lg bg-neutral-50/70 border border-neutral-100 p-3">
                  <span className="text-neutral-500 font-medium">Company Bio</span>
                  <p className="text-neutral-700 mt-1 leading-relaxed">
                    {job.companyDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Simulation Tasks & Candidate Submissions */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Job Description Text */}
          {job.description && (
            <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <h2 className="text-base font-bold text-neutral-900 mb-3">
                Job Description
              </h2>
              <div className="prose prose-sm max-w-none text-neutral-700 max-h-60 overflow-y-auto pr-1">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {job.description}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* AI Simulation Assessment Specification */}
          <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <Zap className="size-4 text-purple-600" />
                  Simulation Tasks ({simulation?.taskCount ?? 0} Tasks)
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  AI-generated assessment tasks configured for this position (Time Limit: {simulation?.timeLimitMinutes ?? 30} mins)
                </p>
              </div>
              {simulation && simulation.tasks.length > 0 && (
                <button
                  type="button"
                  onClick={handleExpandAllTasks}
                  className="text-xs font-medium text-primary-600 hover:text-primary-700 cursor-pointer"
                >
                  {simulation.tasks.every((t, i) => expandedTasks[t.id || String(i)])
                    ? "Collapse all"
                    : "Expand all"}
                </button>
              )}
            </div>

            {!simulation || simulation.tasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-neutral-200 p-8 text-center text-xs text-neutral-500">
                No simulation tasks generated yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {simulation.tasks.map((task, idx) => {
                  const taskKey = task.id || String(idx);
                  const isExpanded = Boolean(expandedTasks[taskKey]);

                  return (
                    <div
                      key={taskKey}
                      className="flex flex-col rounded-xl border border-neutral-200 bg-neutral-50/60 overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTask(taskKey)}
                        className="flex items-center justify-between p-4 text-left cursor-pointer hover:bg-neutral-100/70 transition-colors w-full"
                        aria-expanded={isExpanded}
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                          <span className="text-xs font-bold text-neutral-900 truncate">
                            Task #{idx + 1}: {task.title}
                          </span>
                          <span className="text-[10px] font-semibold bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded shrink-0">
                            {task.category}
                          </span>
                        </div>
                        <ChevronDown
                          className={`size-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-neutral-700" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="flex flex-col gap-3 px-4 pb-4 pt-1 border-t border-neutral-100">
                          {task.scenarioDescription && (
                            <div>
                              <span className="text-[10px] font-semibold text-neutral-500 block mb-1 uppercase tracking-wide">
                                Scenario & Context
                              </span>
                              <div className="prose prose-sm max-w-none text-neutral-700 prose-p:my-1 rounded-lg bg-white border border-neutral-200 p-3">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {task.scenarioDescription}
                                </ReactMarkdown>
                              </div>
                            </div>
                          )}

                          {task.questionPrompt && (
                            <div>
                              <span className="text-[10px] font-semibold text-neutral-500 block mb-1 uppercase tracking-wide">
                                Question Prompt
                              </span>
                              <div className="prose prose-sm max-w-none text-neutral-800 prose-p:my-1 rounded-lg bg-white border border-neutral-200 p-3">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {task.questionPrompt}
                                </ReactMarkdown>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Candidate Applications & Assessments Table */}
          <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Candidate Applications ({submissions.length})
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Assessment attempts, grading results, and proctoring verification
                </p>
              </div>
            </div>

            {submissions.length === 0 ? (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-8 text-center text-xs text-neutral-500">
                No candidates have applied to this job post yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col rounded-xl border border-neutral-200 overflow-hidden">
                  <div className="flex items-center gap-3 bg-neutral-50 px-4 py-2.5 text-xs font-semibold text-neutral-500 border-b border-neutral-200">
                    <span className="flex-1">CANDIDATE</span>
                    <span className="w-24 text-center">SCORE</span>
                    <span className="w-24 text-center">DURATION</span>
                    <span className="w-28 text-center">INTEGRITY</span>
                    <span className="w-24 text-right">ACTION</span>
                  </div>

                  {submissions.slice(0, visibleApplicationsCount).map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/70 transition-colors text-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <p
                          onClick={() => {
                            if (sub.candidateId) {
                              navigate(`/admin/candidate-management/${sub.candidateId}`);
                            }
                          }}
                          className={`font-semibold text-neutral-900 truncate ${
                            sub.candidateId ? "hover:text-primary-600 cursor-pointer hover:underline" : ""
                          }`}
                        >
                          {sub.candidateName}
                        </p>
                        <p className="text-neutral-500 text-[11px] truncate">{sub.candidateEmail}</p>
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

                      <div className="w-24 text-center text-neutral-600">
                        {sub.timeTakenSeconds ? `${Math.round(sub.timeTakenSeconds / 60)} mins` : "N/A"}
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
                          onClick={() =>
                            setSelectedSubmission({
                              id: sub.id,
                              jobId: job.id,
                              jobTitle: job.title || "Job Assessment",
                              companyName: employer.companyName,
                              simulationTitle: job.title || "Job Simulation",
                              status: sub.status as any,
                              overallScore: sub.overallScore,
                              categoryScores: sub.categoryScores as any,
                              taskScores: sub.taskScores as any,
                              timeTakenSeconds: sub.timeTakenSeconds,
                              isAntiCheatFlagged: sub.isAntiCheatFlagged,
                              antiCheatFlags: sub.antiCheatFlags as any,
                              startedAt: null,
                              completedAt: sub.completedAt,
                              createdAt: sub.createdAt,
                            })
                          }
                          className="h-7 px-2 text-xs flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Eye className="size-3" /> View
                        </AdminButton>
                      </div>
                    </div>
                  ))}
                </div>

                <TableLoadMore
                  currentCount={Math.min(submissions.length, visibleApplicationsCount)}
                  totalCount={submissions.length}
                  hasNextPage={visibleApplicationsCount < submissions.length}
                  onLoadMore={() => setVisibleApplicationsCount((prev) => prev + 10)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SubmissionDetailModal
        submission={selectedSubmission}
        open={selectedSubmission !== null}
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
      />

      <RemoveJobPostDialog
        job={
          removeDialogOpen
            ? {
                id: job.id,
                title: job.title || "Untitled Role",
                company: employer.companyName,
                status: "live",
                applicantCount: stats.totalApplicants,
                createdAt: job.createdAt,
              }
            : null
        }
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        onConfirm={handleConfirmRemove}
        isPending={removeJobMutation.isPending}
      />
    </div>
  );
};

export default JobModerationDetailPage;
