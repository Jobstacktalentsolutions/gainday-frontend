import { Trash2 } from "lucide-react";
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

interface DeleteAdminDialogProps {
  admin: AdminUserAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (admin: AdminUserAccount) => void;
  isPending: boolean;
}

export const DeleteAdminDialog = ({
  admin,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DeleteAdminDialogProps) => {
  if (!admin) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex size-10 items-center justify-center rounded-full bg-error-50 text-error-600 mb-2">
            <Trash2 className="size-5" />
          </div>
          <AlertDialogTitle>Delete Admin {admin.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this administrator account ({admin.email}).
            They will immediately lose all access to the Gainday administration portal.
            This action cannot be undone.
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
              variant="destructive"
              size="sm"
              disabled={isPending}
              onClick={() => onConfirm(admin)}
            >
              {isPending ? "Deleting..." : "Delete Account"}
            </AdminButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
