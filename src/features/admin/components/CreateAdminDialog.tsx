import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AdminButton } from "@/components/ui/AdminButton";
import { FormInput } from "@/components/form/FormInput";
import { useCreateAdmin } from "../hooks/useAdmins";

const createAdminSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["SUPER_ADMIN", "MANAGER", "MODERATOR"]),
});

type CreateAdminFormValues = z.infer<typeof createAdminSchema>;

interface CreateAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateAdminDialog = ({ open, onOpenChange }: CreateAdminDialogProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const createAdminMutation = useCreateAdmin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAdminFormValues>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "MANAGER",
    },
  });

  const onSubmit = (values: CreateAdminFormValues) => {
    setServerError(null);
    createAdminMutation.mutate(values, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || "Failed to create administrator account.";
        setServerError(Array.isArray(msg) ? msg[0] : msg);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          reset();
          setServerError(null);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <div className="flex size-10 items-center justify-center rounded-full bg-primary-50 text-primary-600 mb-2">
            <UserPlus className="size-5" />
          </div>
          <DialogTitle className="text-xl font-semibold text-neutral-900">
            Create Admin Account
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-500">
            Add a new team member with administrative privileges. They will use their email and password with mandatory 2FA on sign-in.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 my-2" noValidate>
          <FormInput
            label="Full Name"
            placeholder="Jane Doe"
            required
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <FormInput
            label="Admin Email"
            type="email"
            placeholder="jane@gainday.com"
            required
            error={errors.email?.message}
            {...register("email")}
          />

          <FormInput
            label="Initial Password"
            type="password"
            placeholder="••••••••"
            required
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-base font-medium text-neutral-800 select-none flex items-center gap-1">
              Admin Role <span className="text-error-500">*</span>
            </label>
            <select
              {...register("role")}
              className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none focus:border-primary-500 focus:ring-3 focus:ring-primary-500/20"
            >
              <option value="SUPER_ADMIN">Super Admin (Full Root Privileges)</option>
              <option value="MANAGER">Manager (Employers, Candidates & Operations)</option>
              <option value="MODERATOR">Moderator (Content Moderation & AI Reviews)</option>
            </select>
            {errors.role && (
              <p role="alert" className="text-sm text-error-500">
                {errors.role.message}
              </p>
            )}
          </div>

          {serverError && (
            <div
              role="alert"
              className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
            >
              <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <DialogFooter className="pt-3">
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </AdminButton>
            <AdminButton
              type="submit"
              size="sm"
              disabled={createAdminMutation.isPending}
            >
              {createAdminMutation.isPending ? "Creating..." : "Create Admin"}
            </AdminButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
