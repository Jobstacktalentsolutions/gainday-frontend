import { Crown, Shield, ShieldAlert, Ban, CheckCircle2, Trash2 } from "lucide-react";
import { AdminButton } from "@/components/ui/AdminButton";
import { useAuthStore } from "@/features/auth/store/authStore";
import type { AdminUserAccount } from "../types/user";

interface AdminsTableProps {
  admins: AdminUserAccount[];
  onToggleStatus: (admin: AdminUserAccount) => void;
  onDelete: (admin: AdminUserAccount) => void;
  isUpdatingStatus: boolean;
  isDeleting: boolean;
}

export const AdminsTable = ({
  admins,
  onToggleStatus,
  onDelete,
  isUpdatingStatus,
  isDeleting,
}: AdminsTableProps) => {
  const currentUserId = useAuthStore((state) => state.user?.id);

  if (admins.length === 0) {
    return (
      <div className="w-full rounded-[10px] border border-neutral-200 bg-white px-5 py-10 text-center text-sm text-neutral-500">
        No administrators found matching your search.
      </div>
    );
  }

  const renderRoleBadge = (role?: string, isSuperAdmin?: boolean) => {
    if (isSuperAdmin || role === "SUPER_ADMIN") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <Crown className="w-3.5 h-3.5 text-purple-600" />
          Super Admin
        </span>
      );
    }
    if (role === "MODERATOR") {
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

  const renderStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
        Disabled
      </span>
    );
  };

  return (
    <div
      role="table"
      aria-label="Administrators"
      className="flex w-full flex-col overflow-clip rounded-[10px] border border-neutral-200 bg-white px-5 py-2 shadow-xs"
    >
      <div
        role="row"
        className="flex w-full items-center gap-4 py-3 text-xs font-medium text-neutral-500 border-b border-neutral-100"
      >
        <span role="columnheader" className="min-w-0 flex-1">
          ADMIN USER
        </span>
        <span role="columnheader" className="w-36 shrink-0">
          ROLE
        </span>
        <span role="columnheader" className="w-28 shrink-0 text-center">
          STATUS
        </span>
        <span role="columnheader" className="w-32 shrink-0 text-center">
          2FA STATUS
        </span>
        <span role="columnheader" className="w-40 shrink-0 text-right">
          ACTIONS
        </span>
      </div>

      {admins.map((admin) => {
        const isSelf = admin.id === currentUserId;
        const isPrimaryRoot = admin.adminProfile?.isSuperAdmin;

        return (
          <div
            key={admin.id}
            role="row"
            className="flex w-full items-center gap-4 py-3.5 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/70 transition-colors"
          >
            {/* User Info */}
            <div role="cell" className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 font-semibold text-xs border border-neutral-200">
                {admin.name
                  ? admin.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "AD"}
              </div>
              <div className="flex min-w-0 flex-col">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-neutral-900">
                    {admin.name}
                  </p>
                  {isSelf && (
                    <span className="text-[10px] font-medium bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                      You
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-neutral-500">{admin.email}</p>
              </div>
            </div>

            {/* Role */}
            <div role="cell" className="w-36 shrink-0">
              {renderRoleBadge(admin.adminProfile?.adminRole, admin.adminProfile?.isSuperAdmin)}
            </div>

            {/* Status */}
            <div role="cell" className="w-28 shrink-0 text-center">
              {renderStatusBadge(admin.isActive)}
            </div>

            {/* 2FA Enforced */}
            <div role="cell" className="w-32 shrink-0 text-center">
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Enforced (OTP)
              </span>
            </div>

            {/* Actions */}
            <div role="cell" className="w-40 shrink-0 flex items-center justify-end gap-2">
              <AdminButton
                variant="outline"
                size="sm"
                disabled={isSelf || isUpdatingStatus}
                onClick={() => onToggleStatus(admin)}
                title={isSelf ? "You cannot disable your own account" : admin.isActive ? "Disable account" : "Enable account"}
                className="h-8 px-2.5 text-xs cursor-pointer"
              >
                {admin.isActive ? (
                  <span className="flex items-center gap-1 text-amber-600">
                    <Ban className="w-3.5 h-3.5" /> Disable
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Enable
                  </span>
                )}
              </AdminButton>

              <AdminButton
                variant="destructive"
                size="sm"
                disabled={isSelf || isPrimaryRoot || isDeleting}
                onClick={() => onDelete(admin)}
                title={
                  isSelf
                    ? "You cannot delete your own account"
                    : isPrimaryRoot
                    ? "Primary root admin cannot be deleted"
                    : "Delete admin account"
                }
                className="h-8 px-2.5 text-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </AdminButton>
            </div>
          </div>
        );
      })}
    </div>
  );
};
