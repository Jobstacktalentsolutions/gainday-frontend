import { AlertTriangle } from "lucide-react";
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
import type { AdminUser } from "../types/user";

interface SuspendUserDialogProps {
    user: AdminUser | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (user: AdminUser) => void;
    isPending: boolean;
}

const SuspendUserDialog = ({ user, open, onOpenChange, onConfirm, isPending }: SuspendUserDialogProps) => {
    if (!user) return null;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex size-10 items-center justify-center rounded-full bg-error-50">
                        <AlertTriangle className="size-5 text-error-500" strokeWidth={2} />
                    </div>
                    <AlertDialogTitle>Suspend {user.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        They'll lose access to Gainday immediately and won't be able to
                        sign in until you reinstate their account. Any live job posts or
                        in-progress submissions tied to them will stay visible to other
                        admins.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <AdminButton variant="outline" size="sm" className="cursor-pointer">
                            Cancel
                        </AdminButton>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <AdminButton
                            variant="destructive"
                            size="sm"
                            disabled={isPending}
                            onClick={() => onConfirm(user)}
                            className="cursor-pointer"
                        >
                            {isPending ? "Suspending..." : `Suspend`}
                        </AdminButton>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default SuspendUserDialog;
