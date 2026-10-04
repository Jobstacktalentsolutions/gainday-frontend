import { useNavigate } from "react-router-dom";
import { Bot, ShieldAlert, FileText, UserPlus, ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { DashboardStats } from "../hooks/useDashboardStats";

interface DashboardActionCardsProps {
  stats: DashboardStats;
}

export const DashboardActionCards = ({ stats }: DashboardActionCardsProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {/* CTA 1: Generation Reviews */}
      <div
        onClick={() => navigate("/admin/generation-reviews")}
        className="group relative flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-primary-300 hover:shadow-md transition-all cursor-pointer overflow-hidden"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Bot className="h-5 w-5" />
          </div>
          {stats.pendingReviewsCount > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700 animate-pulse">
              {stats.pendingReviewsCount} Pending
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Up to date
            </span>
          )}
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
              AI Generation Review
            </h3>
            <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Audit and approve LLM-generated task questions
          </p>
        </div>
      </div>

      {/* CTA 2: Anti-Cheat & Oversight */}
      <div
        onClick={() => navigate("/admin/ai-oversight")}
        className="group relative flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer overflow-hidden"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <ShieldAlert className="h-5 w-5" />
          </div>
          {stats.flaggedAntiCheatCount > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
              {stats.flaggedAntiCheatCount} Flagged
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Clean
            </span>
          )}
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-amber-600 transition-colors">
              Anti-Cheat Oversight
            </h3>
            <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Inspect behavioral telemetry and resolve flags
          </p>
        </div>
      </div>

      {/* CTA 3: Content Moderation */}
      <div
        onClick={() => navigate("/admin/content-moderation")}
        className="group relative flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer overflow-hidden"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FileText className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
            {stats.activeJobs} Live Posts
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
              Content Moderation
            </h3>
            <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Inspect live job postings and employer listings
          </p>
        </div>
      </div>

      {/* CTA 4: Admin Team Management */}
      <div
        onClick={() => navigate("/admin/admin-management")}
        className="group relative flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer overflow-hidden"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <UserPlus className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
            Access Control
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-emerald-600 transition-colors">
              Admin Management
            </h3>
            <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage admin team accounts and roles
          </p>
        </div>
      </div>
    </div>
  );
};
