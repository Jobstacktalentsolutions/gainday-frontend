import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { AdminButton } from "@/components/ui/AdminButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { AdminUserAccount } from "../types/user";

interface ToggleAdminStatusDialogProps {
  admin: AdminUserAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (admin: AdminUserAccount) => void;
  isPending: boolean;
}

export const ToggleAdminStatusDialog = ({
  admin,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: ToggleAdminStatusDialogProps) => {
  if (!admin) return null;

  const willDisable = admin.isActive;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-lg sm:max-w-lg">
        <AlertDialogHeader>
          <div
            className={`flex size-10 items-center justify-center rounded-full mb-2 ${
              willDisable ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {willDisable ? <AlertTriangle className="size-5" /> : <CheckCircle2 className="size-5" />}
          </div>
          <AlertDialogTitle>
            {willDisable ? `Disable ${admin.name}?` : `Enable ${admin.name}?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {willDisable
              ? "Disabling this administrator account will immediately revoke their session and prevent them from signing in to the admin console until re-enabled."
              : "Enabling this administrator account will restore their access to sign in to the admin console."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <AdminButton variant="outline" size="sm">
              Cancel
            </AdminButton>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <AdminButton
              variant={willDisable ? "destructive" : "primary"}
              size="sm"
              disabled={isPending}
              onClick={() => onConfirm(admin)}
            >
              {isPending
                ? willDisable
                  ? "Disabling..."
                  : "Enabling..."
                : willDisable
                ? "Disable Account"
                : "Enable Account"}
            </AdminButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
