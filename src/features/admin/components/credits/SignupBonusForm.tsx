import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AdminButton } from "@/components/ui/AdminButton";
import { cn } from "@/lib/utils";
import { useUpdateSignupBonus } from "../../hooks/useCredits";
import { signupBonusSchema, type SignupBonusFormValues } from "../../schemas/signupBonusSchema";
import type { SignupBonusSettings } from "../../types/credits";

interface SignupBonusFormProps {
  settings: SignupBonusSettings;
}

const formatUpdatedAt = (updatedAt: string) =>
  new Date(updatedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

const SignupBonusForm = ({ settings }: SignupBonusFormProps) => {
  const updateSignupBonus = useUpdateSignupBonus();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<SignupBonusFormValues>({
    resolver: zodResolver(signupBonusSchema),
    defaultValues: { enabled: settings.enabled, creditAmount: settings.creditAmount },
  });

  const enabled = useWatch({ control, name: "enabled" });
  const creditAmount = useWatch({ control, name: "creditAmount" });
  const previewCredits = Number.isInteger(creditAmount) ? creditAmount : null;
  const lastChangedText = settings.updatedAt
    ? `Last changed ${formatUpdatedAt(settings.updatedAt)}${settings.updatedByName ? ` by ${settings.updatedByName}` : ""}`
    : "Not set yet";

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateSignupBonus.mutateAsync(values);
      reset(values);
      toast.success("Signup credits updated");
    } catch {
      toast.error("Couldn't save signup credits. Please try again.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
      <div>
        <h2 className="text-sm font-semibold text-neutral-900">Signup bonus</h2>
        <p className="text-xs text-neutral-500">Free credits every new employer receives when they sign up</p>
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-neutral-200 p-4">
        <div>
          <p className="text-sm font-medium text-neutral-900">Grant signup credits</p>
          <p className="text-xs text-neutral-500">{enabled ? "New employers receive credits" : "New employers receive nothing"}</p>
        </div>
        <span className="relative inline-flex shrink-0">
          <input type="checkbox" className="peer sr-only" {...register("enabled")} />
          <span
            aria-hidden="true"
            className="h-6 w-11 rounded-full bg-neutral-300 transition-colors peer-checked:bg-primary-600 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500"
          />
          <span
            aria-hidden="true"
            className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-xs transition-transform peer-checked:translate-x-5"
          />
        </span>
      </label>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="signup-credit-amount" className="text-sm font-medium text-neutral-900">
          Credits per new employer
        </label>
        <input
          id="signup-credit-amount"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          disabled={!enabled}
          className={cn(
            "rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:bg-neutral-50 disabled:text-neutral-400",
            errors.creditAmount && "border-error-500",
          )}
          {...register("creditAmount", { valueAsNumber: true })}
        />
        {errors.creditAmount ? (
          <p className="text-xs text-error-600">{errors.creditAmount.message}</p>
        ) : (
          <p className="text-xs text-neutral-500">
            {enabled && previewCredits !== null
              ? `A new employer can unlock up to ${previewCredits} candidate${previewCredits === 1 ? "" : "s"} for free.`
              : "No credits are granted while this is off."}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-500">{lastChangedText}</p>
        <AdminButton type="submit" disabled={!isDirty || isSubmitting} className="sm:w-auto">
          {isSubmitting ? "Saving..." : "Save changes"}
        </AdminButton>
      </div>
    </form>
  );
};

export default SignupBonusForm;
