import { AlertTriangle } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Application } from "../types/application";

interface WithdrawApplicationDialogProps {
    application: Application | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (application: Application) => void;
    isPending: boolean;
}

const WithdrawApplicationDialog = ({
    application,
    open,
    onOpenChange,
    onConfirm,
    isPending,
}: WithdrawApplicationDialogProps) => {
    if (!application) return null;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex size-10 items-center justify-center rounded-full bg-error-50">
                        <AlertTriangle className="size-5 text-error-500" strokeWidth={2} />
                    </div>
                    <AlertDialogTitle>Withdraw your application?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to withdraw your application for {application.jobTitle}. This cannot be
                        undone, and you will not be able to apply to this job again. The employer will no
                        longer see your submission.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <ActionButton variant="outline" size="sm" disabled={isPending}>
                            Keep application
                        </ActionButton>
                    </AlertDialogCancel>
                    {/* A plain button, not AlertDialogAction: that one closes the dialog on click,
                        and it should stay open (disabled) until the request has settled. */}
                    <ActionButton
                        variant="primary"
                        size="sm"
                        className="bg-error-500 hover:bg-error-600 active:bg-error-600"
                        disabled={isPending}
                        onClick={() => onConfirm(application)}
                    >
                        {isPending ? "Withdrawing..." : "Withdraw application"}
                    </ActionButton>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default WithdrawApplicationDialog;
