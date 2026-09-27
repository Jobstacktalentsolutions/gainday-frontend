import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type AxiosError } from "axios";
import { ArrowLeft, User, Building, Mail, ShieldCheck, KeyRound } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useChangePassword } from "@/features/auth/hooks/useChangePassword";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/auth/schemas/changePasswordSchema";
import PasswordInput from "@/features/auth/component/passwordInput";
import { ActionButton } from "@/components/ui/ActionButton";
import BrandLogo from "@/assets/gainday icon.svg";

const ChangePasswordCard = () => {
  const [success, setSuccess] = useState(false);
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (values: ChangePasswordFormValues) => {
    setSuccess(false);
    changePasswordMutation.mutate(values, {
      onSuccess: () => {
        setSuccess(true);
        reset();
      },
    });
  };

  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-primary-50 p-2.5 text-primary-500">
          <KeyRound className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-neutral-950">Change password</h2>
          <p className="text-sm text-neutral-500">Update the password you sign in with</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex max-w-sm flex-col gap-4">
        <PasswordInput
          label="Current password"
          required
          autoComplete="current-password"
          {...register("currentPassword")}
          error={errors.currentPassword?.message}
        />
        <PasswordInput
          label="New password"
          required
          showChecklist
          autoComplete="new-password"
          {...register("newPassword")}
          error={errors.newPassword?.message}
        />
        <PasswordInput
          label="Confirm new password"
          required
          autoComplete="new-password"
          {...register("confirmNewPassword")}
          error={errors.confirmNewPassword?.message}
        />

        {changePasswordMutation.isError && (
          <p role="alert" className="text-sm text-error-600">
            {(changePasswordMutation.error as AxiosError<{ message?: string }>)?.response?.data
              ?.message ?? "Couldn't change your password. Please try again."}
          </p>
        )}
        {success && (
          <p role="status" className="text-sm text-primary-600">
            Password changed successfully.
          </p>
        )}

        <ActionButton type="submit" className="w-fit" disabled={changePasswordMutation.isPending}>
          {changePasswordMutation.isPending ? "Updating..." : "Update password"}
        </ActionButton>
      </form>
    </div>
  );
};

const ProfilePage = () => {
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const isGoogleAccount = user?.authProvider === "google";

  const getDashboardPath = () => {
    if (user?.role === "EMPLOYER") return "/employer/jobs";
    if (user?.role === "CANDIDATE") return "/job-board";
    return "/";
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-6 pb-16 pt-12 md:px-12">
      <div className="mx-auto max-w-3xl">
        {/* Header with logo link and back button */}
        <div className="mb-10 flex items-center justify-between">
          <Link to={getDashboardPath()} className="shrink-0 transition-opacity hover:opacity-80">
            <img src={BrandLogo} alt="Gainday logo" className="h-10 w-auto" />
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-950"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          {/* Top Banner */}
          <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-800 px-8 pt-8 text-white">
            <h1 className="text-2xl font-bold">User Profile</h1>
            <p className="text-sm text-primary-100">Your registered account details</p>
          </div>

          {/* User Avatar & Main Info */}
          <div className="relative px-8 pb-8">
            <div className="-mt-12 mb-6 flex items-end justify-between">
              <div className="flex size-24 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-primary-500 to-primary-700 text-3xl font-bold text-white shadow-md">
                {(user?.fullName || user?.companyName || user?.email || "U").slice(0, 2).toUpperCase()}
              </div>

              {user?.role && (
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-700">
                  {user.role}
                </span>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-950">
                  {user?.fullName || user?.companyName || "Gainday User"}
                </h2>
                <p className="text-sm text-neutral-500">{user?.email}</p>
              </div>

              <div className="h-px bg-neutral-100" />

              {/* Detail fields */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/60 p-4">
                  <div className="rounded-xl bg-white p-2.5 shadow-xs text-primary-500">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-500">Email Address</p>
                    <p className="text-sm font-semibold text-neutral-900 mt-0.5">{user?.email || "Not specified"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/60 p-4">
                  <div className="rounded-xl bg-white p-2.5 shadow-xs text-primary-500">
                    <User className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-500">Full Name</p>
                    <p className="text-sm font-semibold text-neutral-900 mt-0.5">{user?.fullName || "Not specified"}</p>
                  </div>
                </div>

                {user?.companyName && (
                  <div className="flex items-start gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/60 p-4">
                    <div className="rounded-xl bg-white p-2.5 shadow-xs text-primary-500">
                      <Building className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-500">Company Name</p>
                      <p className="text-sm font-semibold text-neutral-900 mt-0.5">{user.companyName}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/60 p-4">
                  <div className="rounded-xl bg-white p-2.5 shadow-xs text-primary-500">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-500">Account Role</p>
                    <p className="text-sm font-semibold text-neutral-900 mt-0.5">{user?.role || "USER"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isGoogleAccount ? (
          <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8 text-sm text-neutral-500 shadow-sm">
            You sign in with Google, so there's no Gainday password to change here.
          </div>
        ) : (
          <ChangePasswordCard />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
