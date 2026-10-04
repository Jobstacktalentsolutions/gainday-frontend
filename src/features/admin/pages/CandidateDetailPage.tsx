import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Award,
  Briefcase,
  Building2,
  Clock,
  Layers,
  Copy,
  Check,
  Eye,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
} from "lucide-react";
import { toast } from "sonner";
import { AdminButton } from "@/components/ui/AdminButton";
import StatusBadge from "../components/StatusBadge";
import SuspendUserDialog from "../components/SuspendUserDialog";
import { SubmissionDetailModal } from "../components/SubmissionDetailModal";
import { AllSubmissionsModal } from "../components/AllSubmissionsModal";
import { useCandidateDetail } from "../hooks/useCandidateDetail";
import { useSuspendCandidate } from "../hooks/useCandidates";
import type { CandidateSubmission } from "../types/candidateDetail";

const CandidateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<CandidateSubmission | null>(null);
  const [allSubmissionsOpen, setAllSubmissionsOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);

  const { data: candidate, isLoading, isError, refetch } = useCandidateDetail(id);
  const suspendMutation = useSuspendCandidate();

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    toast.success("Email copied to clipboard");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleConfirmSuspend = () => {
    if (!candidate) return;
    suspendMutation.mutate(candidate.id, {
      onSuccess: () => {
        setSuspendOpen(false);
        refetch();
        toast.success(
          candidate.isActive
            ? "Candidate account suspended successfully"
            : "Candidate account activated successfully"
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-6">
        <button
          type="button"
          onClick={() => navigate("/admin/candidate-management")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors w-fit cursor-pointer"
        >
          <ArrowLeft className="size-4" /> Back to Candidate Management
        </button>
        <div className="w-full rounded-2xl border border-neutral-200 bg-white p-12 text-center text-sm text-neutral-500">
          Loading candidate profile details...
        </div>
      </div>
    );
  }

  if (isError || !candidate) {
    return (
      <div className="flex w-full flex-col gap-6">
        <button
          type="button"
          onClick={() => navigate("/admin/candidate-management")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors w-fit cursor-pointer"
        >
          <ArrowLeft className="size-4" /> Back to Candidate Management
        </button>
        <div className="w-full rounded-2xl border border-error-200 bg-error-50 p-12 text-center text-sm text-error-700">
          Failed to load candidate information. The candidate may not exist or has been removed.
        </div>
      </div>
    );
  }

  const { stats, profile, submissions } = candidate;

  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/admin/candidate-management")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" /> Back to Candidate Management
        </button>
      </div>

      {/* Candidate Profile Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 font-bold text-xl border border-primary-100 shadow-xs">
              {candidate.name
                ? candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "CD"}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-bold text-neutral-900">{candidate.name}</h1>
                <StatusBadge status={candidate.status} />
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <Mail className="size-3.5 text-neutral-400" />
                  {candidate.email}
                  <button
                    type="button"
                    onClick={() => handleCopyEmail(candidate.email)}
                    className="ml-0.5 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                    title="Copy email"
                  >
                    {copiedEmail ? (
                      <Check className="size-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </span>

                {profile.phoneNumber && (
                  <span className="flex items-center gap-1">
                    <span className="text-neutral-300">·</span>
                    <Phone className="size-3.5 text-neutral-400" />
                    {profile.phoneNumber}
                  </span>
                )}

                <span className="flex items-center gap-1">
                  <span className="text-neutral-300">·</span>
                  <Calendar className="size-3.5 text-neutral-400" />
                  Joined{" "}
                  {new Date(candidate.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <AdminButton
              variant={candidate.isActive ? "destructive" : "primary"}
              size="sm"
              onClick={() => setSuspendOpen(true)}
              className="cursor-pointer"
            >
              {candidate.isActive ? "Suspend Candidate" : "Activate Candidate"}
            </AdminButton>
          </div>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Total Applications */}
        <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Applied
            </span>
            <Briefcase className="size-4 text-primary-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-1">
            {stats.totalApplications}
          </p>
          <p className="text-[11px] text-neutral-500">Total job applications</p>
        </div>

        {/* Completed Assessments */}
        <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Assessments
            </span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-1">
            {stats.completedSubmissions}
          </p>
          <p className="text-[11px] text-neutral-500">Completed simulations</p>
        </div>

        {/* Average Score */}
        <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Avg Score
            </span>
            <TrendingUp className="size-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-neutral-900">
              {stats.averageScore !== null ? `${stats.averageScore}%` : "N/A"}
            </p>
            {stats.averageScore !== null && (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {stats.averageScore >= 80 ? "Top 10%" : "Proficient"}
              </span>
            )}
          </div>
          <p className="text-[11px] text-neutral-500">Cumulative simulation average</p>
        </div>

        {/* Proctoring Record */}
        <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Proctor Record
            </span>
            {stats.antiCheatFlaggedCount === 0 ? (
              <ShieldCheck className="size-4 text-emerald-600" />
            ) : (
              <ShieldAlert className="size-4 text-error-600" />
            )}
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-1">
            {stats.antiCheatFlaggedCount === 0 ? "100%" : stats.antiCheatFlaggedCount}
          </p>
          <p className="text-[11px] text-neutral-500">
            {stats.antiCheatFlaggedCount === 0
              ? "Clean integrity record"
              : "Flagged proctoring events"}
          </p>
        </div>
      </div>

      {/* Main Content Layout: Bio / Competency on Left, Submissions on Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Bio & Competencies */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Candidate Bio & Details */}
          <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
            <h2 className="text-sm font-bold text-neutral-900 mb-3.5 flex items-center gap-2">
              <Briefcase className="size-4 text-primary-600" />
              Candidate Profile & Bio
            </h2>

            <div className="flex flex-col gap-3 text-xs">
              <div className="rounded-lg bg-neutral-50/70 border border-neutral-100 p-3">
                <span className="text-neutral-500 font-medium">Full Name</span>
                <p className="text-neutral-900 font-semibold mt-0.5">{candidate.name}</p>
              </div>

              <div className="rounded-lg bg-neutral-50/70 border border-neutral-100 p-3">
                <span className="text-neutral-500 font-medium">Email Address</span>
                <p className="text-neutral-900 font-semibold mt-0.5">{candidate.email}</p>
              </div>

              <div className="rounded-lg bg-neutral-50/70 border border-neutral-100 p-3">
                <span className="text-neutral-500 font-medium">Phone Number</span>
                <p className="text-neutral-900 font-semibold mt-0.5">
                  {profile.phoneNumber || "Not provided by candidate"}
                </p>
              </div>

              <div className="rounded-lg bg-neutral-50/70 border border-neutral-100 p-3">
                <span className="text-neutral-500 font-medium">Account Status</span>
                <div className="mt-1">
                  <StatusBadge status={candidate.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Capability Scores / Domain Competencies */}
          <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
            <h2 className="text-sm font-bold text-neutral-900 mb-3.5 flex items-center gap-2">
              <BrainCircuit className="size-4 text-purple-600" />
              Evaluation Competencies
            </h2>

            {profile.capabilityScores && Object.keys(profile.capabilityScores).length > 0 ? (
              <div className="flex flex-col gap-4">
                {Object.entries(profile.capabilityScores).map(([domain, data]) => (
                  <div
                    key={domain}
                    className="flex flex-col gap-2 rounded-xl border border-neutral-100 bg-neutral-50/60 p-3.5"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
                      <span>{domain}</span>
                      <span className="text-primary-600">{data.score}%</span>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-1">
                      {Object.entries(data.categories).map(([catKey, scoreVal]) => {
                        const catLabel = catKey
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase());
                        return (
                          <div key={catKey} className="flex flex-col gap-0.5">
                            <div className="flex items-center justify-between text-[11px] text-neutral-600">
                              <span>{catLabel}</span>
                              <span className="font-semibold text-neutral-800">{scoreVal}/10</span>
                            </div>
                            <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-600 rounded-full"
                                style={{ width: `${(scoreVal / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-neutral-200 p-6 text-center text-xs text-neutral-500">
                <BrainCircuit className="size-6 text-neutral-300 mx-auto mb-1.5" />
                No domain capability anchors computed yet. Complete assessments to generate detailed skill ratings.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Applications & Submissions List */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Recent Applications & Submissions
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Assessment attempts, simulation scores, and proctoring verification
                </p>
              </div>

              {submissions.length > 0 && (
                <AdminButton
                  variant="outline"
                  size="sm"
                  onClick={() => setAllSubmissionsOpen(true)}
                  className="flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Layers className="size-3.5 text-primary-600" />
                  View all ({submissions.length})
                </AdminButton>
              )}
            </div>

            {submissions.length === 0 ? (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-10 text-center text-xs text-neutral-500">
                This candidate has not applied to or submitted any job simulations yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {submissions.slice(0, 5).map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubmission(sub)}
                    className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-primary-200 hover:shadow-xs cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex flex-col gap-0.5">
                        <p className="font-semibold text-sm text-neutral-900 hover:text-primary-600 transition-colors">
                          {sub.jobTitle}
                        </p>
                        <p className="text-xs text-neutral-500 flex items-center gap-1">
                          <Building2 className="size-3 text-neutral-400" />
                          {sub.companyName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {sub.overallScore !== null ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Award className="size-3.5 text-emerald-600" /> {sub.overallScore}%
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                            {sub.status}
                          </span>
                        )}

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
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3 text-neutral-400" />
                          {sub.completedAt
                            ? new Date(sub.completedAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "In Progress"}
                        </span>
                        {sub.timeTakenSeconds && (
                          <span className="flex items-center gap-1">
                            <Clock className="size-3 text-neutral-400" />
                            {Math.round(sub.timeTakenSeconds / 60)} mins
                          </span>
                        )}
                      </div>

                      <span className="text-primary-600 font-semibold flex items-center gap-1 hover:underline">
                        <Eye className="size-3.5" /> View Details
                      </span>
                    </div>
                  </div>
                ))}

                {submissions.length > 5 && (
                  <button
                    type="button"
                    onClick={() => setAllSubmissionsOpen(true)}
                    className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 text-center text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    View remaining {submissions.length - 5} submissions...
                  </button>
                )}
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

      <AllSubmissionsModal
        submissions={submissions}
        candidateName={candidate.name}
        open={allSubmissionsOpen}
        onOpenChange={setAllSubmissionsOpen}
        onSelectSubmission={(sub) => {
          setAllSubmissionsOpen(false);
          setSelectedSubmission(sub);
        }}
      />

      <SuspendUserDialog
        user={
          candidate
            ? {
                id: candidate.id,
                name: candidate.name,
                email: candidate.email,
                status: candidate.status,
                role: "CANDIDATE",
              }
            : null
        }
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
        onConfirm={handleConfirmSuspend}
        isPending={suspendMutation.isPending}
      />
    </div>
  );
};

export default CandidateDetailPage;
