import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Building2, User, Phone, Briefcase, FileText, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import StatusBadge from "./StatusBadge";
import {
  employerEditSchema,
  type EmployerEditFormValues,
} from "../schemas/employerEditSchema";
import type { AdminEmployer } from "../types/user";

interface EditEmployerDialogProps {
  user: AdminEmployer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userId: string, values: EmployerEditFormValues) => void;
  isSaving: boolean;
  initialMode?: "view" | "edit";
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
  initialMode = "view",
}: EditEmployerDialogProps) => {
  const [mode, setMode] = useState<"view" | "edit">(initialMode);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EmployerEditFormValues>({
    resolver: zodResolver(employerEditSchema),
  });

  useEffect(() => {
    if (open) {
      setMode(initialMode);
    }
  }, [open, initialMode]);

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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex flex-col gap-1">
            <DialogTitle>
              {mode === "view" ? "Employer Details" : "Edit Employer Account"}
            </DialogTitle>
            <DialogDescription>
              {mode === "view"
                ? user.email
                : `${user.email} (email cannot be changed)`}
            </DialogDescription>
          </div>

          {/* In view mode, show a pencil icon button to switch into edit mode */}
          {mode === "view" && (
            <button
              type="button"
              onClick={() => setMode("edit")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 shadow-xs hover:bg-neutral-50 hover:text-primary-600 transition-colors cursor-pointer"
              title="Edit employer details"
            >
              <Pencil className="size-3.5 text-primary-600" />
              <span>Edit</span>
            </button>
          )}
        </DialogHeader>

        {mode === "view" ? (
          <div className="flex flex-col gap-4 pt-3">
            {/* Contact & Profile */}
            <div className="rounded-lg border border-neutral-100 bg-neutral-50/60 p-3.5 flex flex-col gap-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Contact & Account
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                    <User className="size-3 text-neutral-400" /> Full Name
                  </span>
                  <p className="font-medium text-neutral-900 mt-0.5">{user.name}</p>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                    <Phone className="size-3 text-neutral-400" /> Phone
                  </span>
                  <p className="font-medium text-neutral-900 mt-0.5">
                    {user.employerProfile.phoneNumber || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="rounded-lg border border-neutral-100 bg-neutral-50/60 p-3.5 flex flex-col gap-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Company Details
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                    <Building2 className="size-3 text-neutral-400" /> Company Name
                  </span>
                  <p className="font-medium text-neutral-900 mt-0.5">
                    {user.employerProfile.companyName}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-neutral-500">Verification</span>
                  <div className="mt-0.5">
                    {user.employerProfile.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="size-3 text-emerald-600" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-full">
                        <XCircle className="size-3 text-neutral-400" /> Unverified
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                    <Briefcase className="size-3 text-neutral-400" /> Job Postings
                  </span>
                  <p className="font-medium text-neutral-900 mt-0.5">
                    {user.employerProfile.jobsCount ?? 0} active
                  </p>
                </div>
                <div>
                  <span className="text-xs text-neutral-500">Account Status</span>
                  <div className="mt-0.5">
                    <StatusBadge status={user.status} />
                  </div>
                </div>
              </div>
            </div>

            {/* Internal Notes */}
            <div className="rounded-lg border border-neutral-100 bg-neutral-50/60 p-3.5 flex flex-col gap-1.5">
              <span className="text-xs font-medium text-neutral-500 flex items-center gap-1">
                <FileText className="size-3 text-neutral-400" /> Internal Notes
              </span>
              <p className="text-xs text-neutral-700 whitespace-pre-wrap mt-1 bg-white p-2.5 rounded border border-neutral-200">
                {user.employerProfile.adminNotes || "No internal notes recorded."}
              </p>
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
              <Button
                type="button"
                size="sm"
                onClick={() => setMode("edit")}
                className="flex items-center gap-1.5"
              >
                <Pencil className="size-3.5" /> Edit Employer
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-3">
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

            <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4">
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

            <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Admin controls
              </p>
              <div className={fieldClass}>
                <label className={labelClass} htmlFor="status">Account status</label>
                <select id="status" className={inputClass} {...register("status")}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="flagged">Flagged</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-neutral-900 cursor-pointer">
                <input type="checkbox" className="size-4 rounded" {...register("isVerified")} />
                Company verified
              </label>
              <div className={fieldClass}>
                <label className={labelClass} htmlFor="adminNotes">
                  Internal notes (not visible to employer)
                </label>
                <textarea
                  id="adminNotes"
                  rows={3}
                  className={inputClass + " resize-none py-2"}
                  {...register("adminNotes")}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (initialMode === "edit") {
                    onOpenChange(false);
                  } else {
                    setMode("view");
                  }
                }}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSaving || !isDirty}>
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployerDialog;