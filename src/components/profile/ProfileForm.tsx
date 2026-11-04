import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ActionButton } from "@/components/ui/ActionButton";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormTextarea } from "@/components/form/FormTextarea";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useUpdateProfile, type UpdateProfilePayload } from "@/features/auth/hooks/useProfile";
import {
  GENDER_OPTIONS,
  PRONOUN_OPTIONS,
  type Gender,
  type Pronouns,
} from "@/features/auth/utils/profileOptions";
import { cn } from "@/lib/utils";

// Mirrors the backend limits in update-profile.dto.ts.
const SUMMARY_MAX = 1000;
const NAME_MAX = 255;

const buildSchema = (isEmployer: boolean, isCandidate: boolean) =>
  z.object({
    fullName: z.string().trim().min(1, "Full name is required").max(NAME_MAX, `Keep your full name under ${NAME_MAX} characters`),
    companyName: isEmployer
      ? z.string().trim().min(1, "Company name is required").max(NAME_MAX, `Keep your company name under ${NAME_MAX} characters`)
      : z.string().optional(),
    phoneNumber: z
      .string()
      .optional()
      .refine((value) => !value || isValidPhoneNumber(value), "Enter a valid phone number for the selected country"),
    pronouns: isCandidate ? z.string().min(1, "Select your pronouns") : z.string().optional(),
    title: isCandidate
      ? z.string().trim().min(1, "Job title is required").max(NAME_MAX, `Keep your job title under ${NAME_MAX} characters`)
      : z.string().optional(),
    gender: z.string().optional(),
    brief: z
      .string()
      .max(SUMMARY_MAX, `Keep your professional summary under ${SUMMARY_MAX.toLocaleString("en-GB")} characters`)
      .optional(),
  });

type ProfileFormValues = z.infer<ReturnType<typeof buildSchema>>;

const ProfileForm = () => {
  const { user } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const isEmployer = user?.role === "EMPLOYER";
  const isCandidate = user?.role === "JOB_SEEKER";

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(buildSchema(isEmployer, isCandidate)),
    defaultValues: {
      fullName: user?.fullName ?? "",
      companyName: user?.companyName ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      pronouns: user?.pronouns ?? "",
      title: user?.title ?? "",
      gender: user?.gender ?? "",
      brief: user?.brief ?? "",
    },
  });

  const brief = useWatch({ control, name: "brief" }) ?? "";
  const overLimit = brief.length > SUMMARY_MAX;

  const onSubmit = async (values: ProfileFormValues) => {
    // Send only what changed.
    const payload: UpdateProfilePayload = {};
    if (dirtyFields.fullName) payload.fullName = values.fullName.trim();
    if (isEmployer && dirtyFields.companyName) payload.companyName = (values.companyName ?? "").trim();
    if (dirtyFields.phoneNumber) payload.phoneNumber = values.phoneNumber ?? "";
    if (isCandidate) {
      if (dirtyFields.pronouns && values.pronouns) payload.pronouns = values.pronouns as Pronouns;
      if (dirtyFields.title) payload.title = (values.title ?? "").trim();
      if (dirtyFields.gender) payload.gender = values.gender ? (values.gender as Gender) : null;
      if (dirtyFields.brief) payload.brief = (values.brief ?? "").trim();
    }

    if (Object.keys(payload).length === 0) {
      toast("No changes to save");
      return;
    }

    try {
      const updated = await updateProfile.mutateAsync(payload);
      reset(values);
      if (isCandidate && user?.isProfileComplete === false && updated.isProfileComplete !== false) {
        toast.success("Profile saved. You can now apply for jobs.");
      } else {
        toast.success("Profile saved");
      }
    } catch {
      toast.error("Couldn't save your profile. Please try again.");
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormInput label="Full name" required placeholder="Enter your full name" hint={`Up to ${NAME_MAX} characters.`} error={errors.fullName?.message} {...register("fullName")} />

        <FormInput label="Email address" value={user?.email ?? ""} readOnly disabled hint="Your email address can't be changed." />

        {isEmployer && (
          <FormInput label="Company name" required placeholder="Enter your company name" hint={`Up to ${NAME_MAX} characters.`} error={errors.companyName?.message} {...register("companyName")} />
        )}

        <Controller
          name="phoneNumber"
          control={control}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="profile-phone" className="text-base font-medium text-neutral-800">
                Phone number
              </label>
              <div
                className={cn(
                  "rounded-lg border bg-white px-3.5 py-2.5 transition-all duration-200",
                  fieldState.error
                    ? "border-error-400 ring-3 ring-error-400/20"
                    : "border-neutral-200 focus-within:border-primary-500 focus-within:ring-3 focus-within:ring-primary-500/20",
                )}
              >
                <PhoneInput
                  international
                  value={field.value || undefined}
                  onChange={(value) => field.onChange(value ?? "")}
                  onBlur={field.onBlur}
                  placeholder="Enter your phone number"
                  className="flex items-center gap-2"
                  numberInputProps={{
                    id: "profile-phone",
                    className: "min-w-0 flex-1 bg-transparent text-base text-neutral-700 outline-none placeholder:text-neutral-400",
                  }}
                />
              </div>
              {fieldState.error && (
                <p role="alert" className="text-sm text-error-500">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        {isCandidate && (
          <>
            <FormSelect label="Pronouns" required placeholder="Select your pronouns" error={errors.pronouns?.message} {...register("pronouns")}>
              {PRONOUN_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelect>

            <FormInput
              label="Job title"
              required
              placeholder="The role you're looking for, e.g. Account Executive"
              hint={`Up to ${NAME_MAX} characters.`}
              error={errors.title?.message}
              {...register("title")}
            />

            <FormSelect label="Gender" placeholder="Prefer not to say" error={errors.gender?.message} {...register("gender")}>
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelect>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <FormTextarea
                label="Professional summary"
                rows={5}
                hint={`Up to ${SUMMARY_MAX.toLocaleString("en-GB")} characters. Employers see this once they unlock your profile.`}
                placeholder="Summarise your experience, strengths and what you're looking for"
                error={errors.brief?.message}
                {...register("brief")}
              />
              <p className={cn("text-right text-sm tabular-nums", overLimit ? "text-error-500" : "text-neutral-400")}>
                {brief.length.toLocaleString("en-GB")} / {SUMMARY_MAX.toLocaleString("en-GB")} characters
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        {isDirty && (
          <button
            type="button"
            onClick={() => reset()}
            disabled={updateProfile.isPending}
            className="h-12 cursor-pointer rounded-xl px-5 text-base font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-50"
          >
            Discard changes
          </button>
        )}
        <ActionButton type="submit" size="lg" className="w-full sm:w-auto sm:px-8" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Saving...
            </>
          ) : (
            "Save profile"
          )}
        </ActionButton>
      </div>
    </form>
  );
};

export default ProfileForm;