import { Crown, Shield, ShieldAlert, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface HowRolesWorkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HowRolesWorkModal = ({ open, onOpenChange }: HowRolesWorkModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-3xl sm:max-w-3xl max-h-[88vh] overflow-y-auto p-6 sm:p-8">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2 text-primary-600 font-semibold text-xs tracking-wider uppercase">
            <Shield className="w-4 h-4" /> Role & Permission Hierarchy
          </div>
          <DialogTitle className="text-2xl font-bold text-neutral-900">
            How Admin Roles Work
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-500">
            Gainday employs a 3-tier role hierarchy to guarantee operational security, auditability, and principle of least privilege across the console.
          </DialogDescription>
        </DialogHeader>

        {/* 3 Major Role Cards */}
        <div className="space-y-4 my-2">
          {/* 1. Super Admin */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-purple-950">
                    1. Super Admin
                  </h3>
                  <p className="text-xs text-purple-700 font-medium">Root Access & Platform Ownership</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-200/80 text-purple-800">
                Tier 1 (Highest)
              </span>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed pl-10">
              The primary root account (seeded via environment variables). Has absolute authority over the entire platform, including managing team admin accounts, assigning permissions, deleting content, and configuring system security.
            </p>
          </div>

          {/* 2. Manager */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-blue-950">
                    2. Manager (Platform Manager)
                  </h3>
                  <p className="text-xs text-blue-700 font-medium">Operations & User Management</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-200/80 text-blue-800">
                Tier 2
              </span>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed pl-10">
              Operations lead account. Can manage employer & candidate accounts, toggle suspensions, delete inappropriate job postings, overturn or uphold anti-cheat flags, and approve AI generation reviews. Cannot create or delete administrator accounts.
            </p>
          </div>

          {/* 3. Moderator */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-amber-950">
                    3. Moderator (Content Moderator)
                  </h3>
                  <p className="text-xs text-amber-700 font-medium">Content & Quality Oversight</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-200/80 text-amber-800">
                Tier 3
              </span>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed pl-10">
              Focused on content moderation, exam integrity, and AI review pipelines. Can review flagged candidate submissions, audit AI-generated question banks, and review live job details. Has read-only access to user directories and cannot alter user credentials.
            </p>
          </div>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="mt-6 border border-neutral-200 rounded-xl overflow-hidden">
          <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200">
            <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
              Capabilities Comparison Matrix
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-100/60 font-semibold text-neutral-700">
                  <th className="py-2.5 px-3">Platform Capability</th>
                  <th className="py-2.5 px-3 text-center text-purple-700">Super Admin</th>
                  <th className="py-2.5 px-3 text-center text-blue-700">Manager</th>
                  <th className="py-2.5 px-3 text-center text-amber-700">Moderator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-600">
                <tr>
                  <td className="py-2 px-3 font-medium text-neutral-800">Create & Delete Admin Accounts</td>
                  <td className="py-2 px-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-2 px-3 text-center"><X className="w-4 h-4 text-neutral-300 mx-auto" /></td>
                  <td className="py-2 px-3 text-center"><X className="w-4 h-4 text-neutral-300 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-neutral-800">Manage Employers & Candidates</td>
                  <td className="py-2 px-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-2 px-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-2 px-3 text-center text-neutral-400">Read-only</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-neutral-800">Suspend / Disable User Accounts</td>
                  <td className="py-2 px-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-2 px-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-2 px-3 text-center"><X className="w-4 h-4 text-neutral-300 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-neutral-800">Content Moderation & Anti-Cheat</td>
                  <td className="py-2 px-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-2 px-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-2 px-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-neutral-800">AI Generation Review & Approval</td>
                  <td className="py-2 px-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-2 px-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-2 px-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-neutral-800">Mandatory 2FA on Every Login</td>
                  <td className="py-2 px-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-2 px-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-2 px-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
