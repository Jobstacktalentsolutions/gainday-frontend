import { useNavigate } from "react-router-dom";
import { UserCheck, ShieldAlert, FileText, UserPlus, ArrowUpRight, CheckCircle2 } from "@/components/ui/icons";
import type { DashboardStats } from "../hooks/useDashboardStats";

interface DashboardActionCardsProps {
  stats: DashboardStats;
}

export const DashboardActionCards = ({ stats }: DashboardActionCardsProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {/* CTA 1: Candidate Directory */}
      <div
        onClick={() => navigate("/admin/candidate-management")}
        className="group relative flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer overflow-hidden"
      >
        <div className="flex items-start justify-between">
          <div className="icon-gradient-frame size-11">
            <span className="text-indigo-600 group-hover:bg-indigo-50"><UserCheck className="size-5" /></span>
          </div>
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
            {stats.candidatesCount} Registered
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-indigo-600 transition-colors">
              Candidate Directory
            </h3>
            <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Audit candidate accounts and simulation attempts
          </p>
        </div>
      </div>

      {/* CTA 2: Anti-Cheat & Oversight */}
      <div
        onClick={() => navigate("/admin/ai-oversight")}
        className="group relative flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer overflow-hidden"
      >
        <div className="flex items-start justify-between">
          <div className="icon-gradient-frame size-11">
            <span className="text-amber-600 group-hover:bg-amber-50"><ShieldAlert className="size-5" /></span>
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
          <div className="icon-gradient-frame size-11">
            <span className="text-blue-600 group-hover:bg-blue-50"><FileText className="size-5" /></span>
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
          <div className="icon-gradient-frame size-11">
            <span className="text-emerald-600 group-hover:bg-emerald-50"><UserPlus className="size-5" /></span>
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
