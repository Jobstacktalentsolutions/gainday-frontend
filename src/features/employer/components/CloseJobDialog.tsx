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

interface CloseJobDialogProps {
    jobTitle: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isPending: boolean;
}

const CloseJobDialog = ({ jobTitle, open, onOpenChange, onConfirm, isPending }: CloseJobDialogProps) => (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <div className="flex size-10 items-center justify-center rounded-full bg-error-50">
                    <AlertTriangle className="size-5 text-error-500" strokeWidth={2} />
                </div>
                <AlertDialogTitle>Close this job?</AlertDialogTitle>
                <AlertDialogDescription>
                    "{jobTitle}" will be taken off the job board and stop accepting applications. Candidates who
                    have already applied keep their applications, and you can still review every submission.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel asChild>
                    <ActionButton variant="outline" size="sm" disabled={isPending}>
                        Keep it open
                    </ActionButton>
                </AlertDialogCancel>
                {/* A plain button, not AlertDialogAction: that one closes the dialog on click, and it
                    should stay open (disabled) until the request has settled. */}
                <ActionButton
                    variant="primary"
                    size="sm"
                    className="bg-error-500 hover:bg-error-600 active:bg-error-600"
                    disabled={isPending}
                    onClick={onConfirm}
                >
                    {isPending ? "Closing..." : "Close job"}
                </ActionButton>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);

export default CloseJobDialog;
