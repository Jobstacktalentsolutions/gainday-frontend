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
import type { AdminJob } from "../types/job";

interface RemoveJobPostDialogProps {
  job: AdminJob | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (job: AdminJob) => void;
  isPending: boolean;
}

const RemoveJobPostDialog = ({
  job,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: RemoveJobPostDialogProps) => {
  if (!job) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex size-10 items-center justify-center rounded-full bg-error-50">
            <AlertTriangle className="size-5 text-error-500" strokeWidth={2} />
          </div>
          <AlertDialogTitle>Remove "{job.title}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This takes the post down from the Gainday board immediately.
            {job.applicantCount > 0 &&
              ` ${job.applicantCount} applicant${job.applicantCount === 1 ? "" : "s"} currently in the pipeline will no longer be able to access it.`}
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
              onClick={() => onConfirm(job)}
            >
              {isPending ? "Removing..." : "Remove Post"}
            </AdminButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveJobPostDialog;