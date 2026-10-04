import { Crown, Shield, ShieldAlert, ShieldCheck, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { AdminUserAccount } from "../types/user";

interface ViewAdminDialogProps {
  admin: AdminUserAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleStatus?: (admin: AdminUserAccount) => void;
}

export const ViewAdminDialog = ({
  admin,
  open,
  onOpenChange,
  onToggleStatus,
}: ViewAdminDialogProps) => {
  if (!admin) return null;

  const renderRoleBadge = () => {
    if (admin.adminProfile?.isSuperAdmin || admin.adminProfile?.adminRole === "SUPER_ADMIN") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <Crown className="w-3.5 h-3.5 text-purple-600" />
          Super Admin
        </span>
      );
    }
    if (admin.adminProfile?.adminRole === "MODERATOR") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          Moderator
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        <Shield className="w-3.5 h-3.5 text-blue-600" />
        Manager
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Administrator Details</DialogTitle>
          <DialogDescription>{admin.email}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-3">
          {/* Profile Overview */}
          <div className="rounded-lg border border-neutral-100 bg-neutral-50/60 p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-800 font-semibold text-sm border border-neutral-300">
                {admin.name
                  ? admin.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "AD"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-neutral-900 truncate">{admin.name}</p>
                <p className="text-xs text-neutral-500 truncate">{admin.email}</p>
              </div>
              {renderRoleBadge()}
            </div>
          </div>

          {/* Details Grid */}
          <div className="rounded-lg border border-neutral-100 bg-neutral-50/60 p-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-neutral-500">Account Status</span>
              <div className="mt-1">
                {admin.isActive ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                    Disabled
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-xs text-neutral-500">2FA Security</span>
              <div className="mt-1 flex items-center gap-1 text-xs text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Enforced (OTP)
              </div>
            </div>

            <div>
              <span className="text-xs text-neutral-500 flex items-center gap-1">
                <ShieldCheck className="size-3 text-neutral-400" /> System Role
              </span>
              <p className="font-medium text-neutral-900 mt-0.5">
                {admin.adminProfile?.adminRole || "ADMIN"}
              </p>
            </div>

            <div>
              <span className="text-xs text-neutral-500 flex items-center gap-1">
                <Calendar className="size-3 text-neutral-400" /> Created
              </span>
              <p className="font-medium text-neutral-900 mt-0.5">
                {admin.createdAt
                  ? new Date(admin.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Active"}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          {onToggleStatus && !admin.adminProfile?.isSuperAdmin && (
            <Button
              type="button"
              variant={admin.isActive ? "destructive" : "default"}
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onToggleStatus(admin);
              }}
            >
              {admin.isActive ? "Disable Account" : "Enable Account"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAdminDialog;
