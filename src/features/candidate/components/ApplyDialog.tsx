import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { ActionButton } from "@/components/ui/ActionButton";
import { FormInput } from "@/components/form/FormInput";
import { PhoneInput, PHONE_COUNTRIES } from "./PhoneInput";
import { guestInfoSchema, type GuestInfoValues } from "../auth/schema";

interface ApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignUp: () => void;
  onGuestSubmit: (values: GuestInfoValues) => void;
  isSubmittingGuest?: boolean;
}

export function ApplyDialog({ open, onOpenChange, onSignUp, onGuestSubmit, isSubmittingGuest }: ApplyDialogProps) {
  const [step, setStep] = useState<"choose" | "guest">("choose");

  // reset to the first step every time the dialog reopens
  useEffect(() => {
    if (open) setStep("choose");
  }, [open]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<GuestInfoValues>({
    resolver: zodResolver(guestInfoSchema),
    mode: "onChange",
    defaultValues: { fullName: "", email: "", phoneCountry: PHONE_COUNTRIES[0].code, phoneNumber: "" },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[566px] gap-[60px] rounded-2xl p-12">
        {step === "choose" ? (
          <>
            <DialogHeader className="items-center gap-2 text-center">
              <DialogTitle className="text-[32px] leading-[38px] tracking-[-0.32px] text-primary-950">
                How would you like to apply?
              </DialogTitle>
              <DialogDescription className="text-[16px] text-neutral-700">
                Both paths lead to the same work simulation.
              </DialogDescription>
            </DialogHeader>
            <div className="flex w-full flex-col gap-4">
              <ActionButton variant="primary" size="lg" onClick={onSignUp}>
                Sign up to apply
              </ActionButton>
              <ActionButton variant="outline" size="lg" onClick={() => setStep("guest")}>
                Continue as guest
              </ActionButton>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="items-center gap-2 text-center">
              <DialogTitle className="text-[32px] leading-[38px] tracking-[-0.32px] text-primary-950">
                Continue as guest
              </DialogTitle>
              <DialogDescription className="text-[16px] text-neutral-700">
                You&apos;ll still get your results by email. You just won&apos;t have a saved Capability Score to
                track across future applications.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onGuestSubmit)} className="flex w-full flex-col gap-4">
              <FormInput label="Name" error={errors.fullName?.message} {...register("fullName")} />
              <FormInput label="Email" type="email" error={errors.email?.message} {...register("email")} />
              <Controller
                control={control}
                name="phoneCountry"
                render={({ field: countryField }) => (
                  <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field: numberField }) => (
                      <PhoneInput
                        countryCode={countryField.value}
                        onCountryChange={countryField.onChange}
                        value={numberField.value}
                        onChange={numberField.onChange}
                        onBlur={numberField.onBlur}
                        error={errors.phoneNumber?.message}
                      />
                    )}
                  />
                )}
              />
              <ActionButton type="submit" variant="primary" size="lg" disabled={!isValid || isSubmittingGuest}>
                {isSubmittingGuest ? "Continuing..." : "Continue"}
              </ActionButton>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}