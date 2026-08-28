import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  employerEditSchema,
  type EmployerEditFormValues,
} from "../schemas/employerEditSchema";
import type { AdminUser } from "../types/user";

interface EditEmployerDialogProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userId: string, values: EmployerEditFormValues) => void;
  isSaving: boolean;
}

const inputClass =
  "h-10 w-full rounded-[6px] border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500";
const labelClass = "text-xs font-medium text-neutral-500";
const fieldClass = "flex flex-col gap-1.5";

const EditEmployerDialog = ({
  user,
  open,
  onOpenChange,
  onSave,
  isSaving,
}: EditEmployerDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EmployerEditFormValues>({
    resolver: zodResolver(employerEditSchema),
  });

  useEffect(() => {
    if (user?.employerProfile) {
      reset({
        name: user.name,
        status: user.status,
        isVerified: user.employerProfile.isVerified,
        companyName: user.employerProfile.companyName,
        adminNotes: user.employerProfile.adminNotes ?? "",
      });
    }
  }, [user, reset]);

  if (!user) return null;

  const onSubmit = (values: EmployerEditFormValues) => {
    onSave(user.id, values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit employer account</DialogTitle>
          <DialogDescription>{user.email} (email can't be changed here)</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-5">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Contact
            </p>
            <div className={fieldClass}>
              <label className={labelClass} htmlFor="fullName">Full name</label>
              <input id="fullName" className={inputClass} {...register("name")} />
              {errors.name && (
                <p className="text-xs text-error-600">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-neutral-100 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Company
            </p>
            <div className={fieldClass}>
              <label className={labelClass} htmlFor="companyName">Company name</label>
              <input id="companyName" className={inputClass} {...register("companyName")} />
              {errors.companyName && (
                <p className="text-xs text-error-600">{errors.companyName.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-neutral-100 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Admin controls
            </p>
            <div className={fieldClass}>
              <label className={labelClass} htmlFor="status">Account status</label>
              <select id="status" className={inputClass} {...register("status")}>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-neutral-900">
              <input type="checkbox" className="size-4 rounded" {...register("isVerified")} />
              Company verified
            </label>
            <div className={fieldClass}>
              <label className={labelClass} htmlFor="adminNotes">Internal notes (not visible to employer)</label>
              <textarea
                id="adminNotes"
                rows={3}
                className={inputClass + " resize-none py-2"}
                {...register("adminNotes")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSaving || !isDirty}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployerDialog;