import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Building,
  Mail,
  Phone,
  Pencil,
  Check,
  X,
  Lock,
  Loader2,
  KeyRound,
  UserRound,
  FileText,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { formatPhoneForDisplay } from "@/lib/phone";
import CandidateHeader from "@/features/candidate/components/CandidateHeader";
import { PublicNavbar } from "@/features/candidate/components/PublicNavbar";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useUpdateProfile, type UpdateProfilePayload } from "@/features/auth/hooks/useProfile";
import { ActionButton } from "@/components/ui/ActionButton";
import {
  GENDER_OPTIONS,
  PRONOUN_OPTIONS,
  type Gender,
  type Pronouns,
} from "@/features/auth/utils/profileOptions";

interface FieldOption {
  value: string;
  label: string;
}

interface EditableFieldProps {
  label: string;
  value: string | undefined | null;
  /** How the field is edited. Defaults to a single-line text input. */
  input?: "text" | "textarea" | "select" | "phone";
  /** Required for `select`. */
  options?: FieldOption[];
  /** Marks the field as mandatory and flags it while it is empty. */
  required?: boolean;
  placeholder?: string;
  icon: typeof User;
  editable?: boolean;
  tooltip?: string;
  onSave?: (newValue: string) => Promise<void>;
  isSaving?: boolean;
}

const BRIEF_MAX_LENGTH = 1000;

const EDIT_CONTROL_CLASS =
  "flex-1 min-w-0 rounded-lg border border-primary-400 px-3 py-1.5 text-sm font-medium text-neutral-900 outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50";

const EditableProfileField = ({
  label,
  value,
  input = "text",
  options,
  required = false,
  placeholder = "Not specified",
  icon: Icon,
  editable = false,
  tooltip,
  onSave,
  isSaving = false,
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(value ?? "");

  const handleStartEditing = () => {
    setDraftValue(value ?? "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraftValue(value ?? "");
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSave) return;
    if (required && !draftValue) {
      toast.error(`${label} is required.`);
      return;
    }
    if (input === "phone" && draftValue && !isValidPhoneNumber(draftValue)) {
      toast.error("Enter a valid phone number for the selected country.");
      return;
    }
    try {
      await onSave(draftValue.trim());
      setIsEditing(false);
    } catch {
      // Error handled by parent toast
    }
  };

  const displayValue =
    input === "select"
      ? options?.find((option) => option.value === value)?.label
      : input === "phone" && value
        ? formatPhoneForDisplay(value)
        : value;
  const isMissingRequired = required && !value;

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl border bg-neutral-50/70 p-4 transition-all hover:border-neutral-300 sm:p-4.5 ${
        isMissingRequired ? "border-warning-300" : "border-neutral-200/70"
      } ${input === "textarea" ? "sm:col-span-2" : ""}`}
    >
      {/* Top Header Row: Icon + Label on Left, Edit / Lock status on Right */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-primary-500 shadow-2xs border border-neutral-100">
            <Icon className="size-3.5" />
          </div>
          <p className="truncate text-xs font-medium text-neutral-500">
            {label}
            {required && <span className="text-error-500"> *</span>}
          </p>
        </div>

        <div>
          {editable ? (
            !isEditing && (
              <button
                type="button"
                onClick={handleStartEditing}
                className="flex size-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-white hover:text-neutral-700 hover:shadow-xs transition-all cursor-pointer"
                title={`Edit ${label}`}
              >
                <Pencil className="size-3.5" />
              </button>
            )
          ) : (
            <span
              className="flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500 select-none"
              title={tooltip || "This field cannot be changed"}
            >
              <Lock className="size-3" />
              <span>Locked</span>
            </span>
          )}
        </div>
      </div>

      {/* Bottom Content Row: Full-width Input in Edit Mode or Display Value */}
      <div className="mt-2.5 min-w-0">
        {isEditing ? (
          <form
            onSubmit={handleSave}
            className={`flex w-full gap-1.5 ${input === "textarea" ? "items-start" : "items-center"}`}
          >
            {input === "select" && options ? (
              <select
                value={draftValue}
                onChange={(e) => setDraftValue(e.target.value)}
                disabled={isSaving}
                autoFocus
                className={`${EDIT_CONTROL_CLASS} bg-white`}
              >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : input === "phone" ? (
              <PhoneInput
                international
                value={draftValue || undefined}
                onChange={(next) => setDraftValue(next ?? "")}
                placeholder={placeholder}
                disabled={isSaving}
                className="flex min-w-0 flex-1 items-center gap-2"
                numberInputProps={{ autoFocus: true, className: EDIT_CONTROL_CLASS }}
              />
            ) : input === "textarea" ? (
              <textarea
                value={draftValue}
                onChange={(e) => setDraftValue(e.target.value)}
                placeholder={placeholder}
                disabled={isSaving}
                maxLength={BRIEF_MAX_LENGTH}
                rows={4}
                autoFocus
                className={`${EDIT_CONTROL_CLASS} resize-y`}
              />
            ) : (
              <input
                type="text"
                value={draftValue}
                onChange={(e) => setDraftValue(e.target.value)}
                placeholder={placeholder}
                disabled={isSaving}
                autoFocus
                className={EDIT_CONTROL_CLASS}
              />
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 cursor-pointer"
              title="Save"
            >
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 cursor-pointer"
              title="Cancel"
            >
              <X className="size-4" />
            </button>
          </form>
        ) : (
          <p
            className={`text-sm font-semibold text-neutral-900 ${input === "textarea" ? "whitespace-pre-line" : "truncate"}`}
          >
            {displayValue || <span className="font-normal italic text-neutral-400">{placeholder}</span>}
          </p>
        )}
      </div>
    </div>
  );
};

const ChangePasswordCard = () => {
  const { user } = useCurrentUser();
  const forgotPasswordPath =
    user?.role === "EMPLOYER" ? "/employer/forgot-password" : "/candidate/forgot-password";
  const forgotPasswordHref = user?.email
    ? `${forgotPasswordPath}?email=${encodeURIComponent(user.email)}`
    : forgotPasswordPath;

  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-primary-50 p-2.5 text-primary-500">
          <KeyRound className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-neutral-950">Change password</h2>
          <p className="text-sm text-neutral-500">Update the password you sign in with</p>
        </div>
      </div>

      <Link to={forgotPasswordHref}>
        <ActionButton type="button" className="w-fit">
          Change password
        </ActionButton>
      </Link>
    </div>
  );
};

const ProfilePage = () => {
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const updateProfileMutation = useUpdateProfile();
  const isGoogleAccount = user?.authProvider === "google";
  const isEmployer = user?.role === "EMPLOYER";
  const isCandidate = user?.role === "JOB_SEEKER";

  const handleUpdateProfile = async (payload: UpdateProfilePayload) => {
    try {
      await updateProfileMutation.mutateAsync(payload);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Couldn't update profile. Please try again.");
      throw new Error("Update failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50">
      {/* If accessed standalone or outside employer shell, render candidate/public navbar */}
      {!isEmployer && (user?.role === "JOB_SEEKER" ? <CandidateHeader /> : <PublicNavbar />)}

      <main className="mx-auto flex w-full max-w-3xl flex-col px-4 pb-16 pt-28 sm:px-6 sm:pt-36 lg:px-8">
        {/* Back navigation button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        </div>

        {/* Profile Card with Ambient Gradient Blobs */}
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-[0px_4px_10px_rgba(16,24,40,0.05)] sm:p-10">
          {/* Decorative ambient gradient blobs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-5 -top-64 z-0 h-105 w-95 rotate-[-49deg] rounded-full opacity-35 blur-3xl bg-[linear-gradient(180deg,var(--color-primary-500)_40%,var(--color-secondary-500)_55%,var(--color-secondary-300)_65%,transparent_100%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-5 -top-64 z-0 h-105 w-95 rotate-49 rounded-full opacity-35 blur-3xl bg-[linear-gradient(180deg,var(--color-primary-500)_40%,var(--color-secondary-500)_55%,var(--color-secondary-300)_65%,transparent_100%)]"
          />

          <div className="relative z-10 space-y-8">
            {/* Header with single person avatar icon */}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border-2 border-primary-100 bg-primary-50 text-primary-500 shadow-sm sm:size-24">
                <User className="size-10 text-primary-500 sm:size-12" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary-500">
                  Account Profile
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                  {user?.fullName || user?.companyName || "Gainday User"}
                </h1>
                <p className="text-sm text-neutral-500">{user?.email}</p>
              </div>
            </div>

            {isCandidate && user?.isProfileComplete === false && (
              <div
                role="status"
                className="flex items-start gap-3 rounded-2xl border border-warning-200 bg-warning-50 p-4 text-sm text-warning-900"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p>Your profile is incomplete. Add your pronouns and job title to be able to apply for jobs.</p>
              </div>
            )}

            <div className="h-px w-full bg-neutral-100" />

            {/* Editable Profile Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <EditableProfileField
                label="Full Name"
                value={user?.fullName}
                placeholder="Enter your full name"
                icon={User}
                editable
                onSave={(val) => handleUpdateProfile({ fullName: val })}
                isSaving={updateProfileMutation.isPending}
              />

              <EditableProfileField
                label="Email Address"
                value={user?.email}
                icon={Mail}
                editable={false}
                tooltip="Email address cannot be changed"
              />

              {isEmployer && (
                <EditableProfileField
                  label="Company Name"
                  value={user?.companyName}
                  placeholder="Enter your company name"
                  icon={Building}
                  editable
                  onSave={(val) => handleUpdateProfile({ companyName: val })}
                  isSaving={updateProfileMutation.isPending}
                />
              )}

              <EditableProfileField
                label="Phone Number"
                value={user?.phoneNumber}
                input="phone"
                placeholder="Enter your phone number"
                icon={Phone}
                editable
                onSave={(val) => handleUpdateProfile({ phoneNumber: val })}
                isSaving={updateProfileMutation.isPending}
              />

              {isCandidate && (
                <>
                  <EditableProfileField
                    label="Pronouns"
                    value={user?.pronouns}
                    input="select"
                    options={PRONOUN_OPTIONS}
                    required
                    placeholder="Select your pronouns"
                    icon={UserRound}
                    editable
                    onSave={(val) => handleUpdateProfile({ pronouns: val as Pronouns })}
                    isSaving={updateProfileMutation.isPending}
                  />

                  <EditableProfileField
                    label="Job Title"
                    value={user?.title}
                    required
                    placeholder="The role you're looking for, e.g. Account Executive"
                    icon={Briefcase}
                    editable
                    onSave={(val) => handleUpdateProfile({ title: val })}
                    isSaving={updateProfileMutation.isPending}
                  />

                  <EditableProfileField
                    label="Gender (optional)"
                    value={user?.gender}
                    input="select"
                    options={GENDER_OPTIONS}
                    placeholder="Prefer not to say"
                    icon={UserRound}
                    editable
                    onSave={(val) => handleUpdateProfile({ gender: val === "" ? null : (val as Gender) })}
                    isSaving={updateProfileMutation.isPending}
                  />

                  <EditableProfileField
                    label="Brief (optional)"
                    value={user?.brief}
                    input="textarea"
                    placeholder="A short introduction employers will see once they unlock you"
                    icon={FileText}
                    editable
                    onSave={(val) => handleUpdateProfile({ brief: val })}
                    isSaving={updateProfileMutation.isPending}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Change Password Card or Google Account notice */}
        {isGoogleAccount ? (
          <div className="mt-6 rounded-3xl border border-neutral-200/80 bg-white p-6 text-sm text-neutral-500 shadow-xs sm:p-8">
            You sign in with Google, so there's no Gainday password to change here.
          </div>
        ) : (
          <ChangePasswordCard />
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
