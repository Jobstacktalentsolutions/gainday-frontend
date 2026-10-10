import { CheckCircle2 } from "lucide-react";
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
import type { AdminAccount } from "../types/user";

interface UnsuspendUserDialogProps {
  user: AdminAccount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (user: AdminAccount) => void;
  isPending: boolean;
}

export const UnsuspendUserDialog = ({
  user,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: UnsuspendUserDialogProps) => {
  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-lg sm:max-w-lg">
        <AlertDialogHeader>
          <div className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-2">
            <CheckCircle2 className="size-5" />
          </div>
          <AlertDialogTitle>Unsuspend {user.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately reinstate the user's account and restore their
            ability to sign in. The previous suspension record will be cleared.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-3">
          <AlertDialogCancel asChild>
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
            >
              Cancel
            </AdminButton>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <AdminButton
              type="button"
              variant="primary"
              size="sm"
              disabled={isPending}
              onClick={() => onConfirm(user)}
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isPending ? "Unsuspending..." : "Confirm Unsuspend"}
            </AdminButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnsuspendUserDialog;
