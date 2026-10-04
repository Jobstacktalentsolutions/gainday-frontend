import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  Award,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Building2,
  UserCheck,
} from "lucide-react";
import { useDashboardStats, type Timeframe } from "../hooks/useDashboardStats";
import { AnalyticsChart } from "../components/AnalyticsChart";
import { DashboardActionCards } from "../components/DashboardActionCards";
import StatusBadge from "../components/StatusBadge";
import { AdminButton } from "@/components/ui/AdminButton";

import { DashboardSkeleton } from "../components/skeletons";

const AdminDashboard = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const { data, isLoading, isError, isFetching } = useDashboardStats(timeframe);
  const navigate = useNavigate();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="w-full rounded-xl border border-error-200 bg-error-50 p-8 text-center text-error-700">
        <h3 className="text-base font-semibold">Failed to load Dashboard Analytics</h3>
        <p className="text-xs text-error-600 mt-1">
          Could not establish connection to the analytics service. Please try refreshing.
        </p>
      </div>
    );
  }

  const { stats, analytics, recentJobs } = data;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Control Center Dashboard
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time platform telemetry, user acquisition metrics, and operational moderation queues
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AdminButton
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/content-moderation")}
            className="text-xs bg-white cursor-pointer"
          >
            Moderate Live Posts
          </AdminButton>
          <AdminButton
            size="sm"
            onClick={() => navigate("/admin/generation-reviews")}
            className="text-xs bg-primary-600 hover:bg-primary-700 text-white cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Review Question Bank
          </AdminButton>
        </div>
      </div>

      {/* 1. Quick Action CTAs */}
      <DashboardActionCards stats={stats} />

      {/* 2. Key Operational Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Jobs */}
        <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Active Job Posts
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-neutral-900">{stats.activeJobs}</span>
            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
              <span className="font-semibold text-emerald-600">{stats.jobsFilled}</span> jobs filled / completed
            </p>
          </div>
        </div>

        {/* Total Users */}
        <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Accounts
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-neutral-900">{stats.totalUsers}</span>
            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
              <span><strong className="text-neutral-700">{stats.candidatesCount}</strong> Candidates</span>
              <span>•</span>
              <span><strong className="text-neutral-700">{stats.employersCount}</strong> Employers</span>
            </p>
          </div>
        </div>

        {/* Simulation Submissions */}
        <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Simulations Run
            </span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-neutral-900">{stats.totalSubmissions}</span>
            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
              <span><strong className="text-emerald-600">{stats.scoredSubmissions}</strong> Scored</span>
              <span>•</span>
              <span><strong className="text-amber-600">{stats.openSubmissions}</strong> Pending</span>
            </p>
          </div>
        </div>

        {/* Integrity & Flags */}
        <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Pending Actions
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-neutral-900">
              {stats.flaggedAntiCheatCount + stats.pendingReviewsCount}
            </span>
            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
              <span><strong className="text-amber-600">{stats.flaggedAntiCheatCount}</strong> Flags</span>
              <span>•</span>
              <span><strong className="text-purple-600">{stats.pendingReviewsCount}</strong> AI Reviews</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Time-Series Analytics Chart */}
      <AnalyticsChart
        data={analytics}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        isLoading={isFetching}
      />

      {/* 4. Bottom Activity & Moderation Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Job Posts Queue */}
        <section className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-xs lg:col-span-2">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Live Job Posts
                </h2>
                <p className="text-xs text-neutral-500">Recent hiring simulations published on Gainday</p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/admin/content-moderation")}
                className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
              >
                View all in Moderation <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-neutral-100 mt-1">
              {recentJobs.length === 0 ? (
                <p className="py-8 text-center text-xs text-neutral-400">
                  No active job postings recorded yet.
                </p>
              ) : (
                recentJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => navigate("/admin/content-moderation")}
                    className="flex items-center justify-between py-3.5 px-2 hover:bg-neutral-50/80 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 truncate">
                          {job.title}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">
                          {job.company} •{" "}
                          <span className="font-medium text-neutral-700">
                            {job.applicantsCount} {job.applicantsCount === 1 ? "applicant" : "applicants"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={job.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* System Integrity & Fast Links */}
        <section className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
          <div>
            <div className="pb-3 border-b border-neutral-100">
              <h2 className="text-base font-bold text-neutral-900">
                System Oversight
              </h2>
              <p className="text-xs text-neutral-500">Quality, integrity & account management</p>
            </div>

            <div className="space-y-3.5 mt-4">
              {/* Employers */}
              <div
                onClick={() => navigate("/admin/employer-management")}
                className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50/60 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Employer Accounts</p>
                    <p className="text-[11px] text-neutral-500">{stats.employersCount} registered companies</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </div>

              {/* Candidates */}
              <div
                onClick={() => navigate("/admin/candidate-management")}
                className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50/60 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">Candidate Directory</p>
                    <p className="text-[11px] text-neutral-500">{stats.candidatesCount} job seekers</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </div>

              {/* AI Question Reviews */}
              <div
                onClick={() => navigate("/admin/generation-reviews")}
                className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50/60 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-purple-50 text-purple-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">AI Task Review Queue</p>
                    <p className="text-[11px] text-neutral-500">
                      {stats.pendingReviewsCount} items awaiting approval
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-neutral-100 text-center">
            <p className="text-[11px] text-neutral-400">
              Gainday Admin Console • 2FA Enforced
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;