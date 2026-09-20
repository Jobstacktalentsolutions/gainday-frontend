import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Mail } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { PublicNavbar } from "@/features/candidate/components/PublicNavbar";
import { FormInput } from "@/components/form/FormInput";
import { ActionButton } from "@/components/ui/ActionButton";
import { forgetPasswordSchema, type forgetPasswordFormValues } from "@/features/auth/schemas/forgetPasswordSchema";

export default function CandidateForgotPassword() {
    const [searchParams] = useSearchParams();
    const defaultEmail = searchParams.get("email") || "";
    const [sentTo, setSentTo] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<forgetPasswordFormValues>({
        resolver: zodResolver(forgetPasswordSchema),
        defaultValues: { email: defaultEmail },
    });

    const requestResetMutation = useMutation({
        mutationFn: (values: forgetPasswordFormValues) =>
            apiClient.post("/auth/request-password-reset", values),
        onSuccess: (_res, values) => setSentTo(values.email),
    });

    return (
        <div className="min-h-screen w-full bg-neutral-50">
            <PublicNavbar />
            <main className="flex w-full justify-center px-4 pt-55 pb-12">
                <div className="w-full max-w-120 rounded-2xl bg-white px-10 py-12 shadow-sm">
                    {sentTo ? (
                        <div className="flex w-full flex-col items-center gap-6 text-center">
                            <div className="flex size-16 items-center justify-center rounded-xl bg-primary-50">
                                <Mail className="size-8 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-[32px] leading-9.5 tracking-[-0.32px] text-primary-950">Check your inbox</h1>
                                <p className="text-[16px] text-neutral-700">We sent a password reset link to {sentTo}</p>
                            </div>
                            <ActionButton
                                variant="outline"
                                className="w-full"
                                onClick={() => requestResetMutation.mutate({ email: sentTo })}
                            >
                                Resend Mail
                            </ActionButton>
                            <button onClick={() => setSentTo(null)} className="text-base text-neutral-700">
                                Wrong email? <span className="text-primary-500">Go back</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8 flex flex-col items-center gap-2 text-center">
                                <h1 className="text-[32px] leading-9.5 tracking-[-0.32px] text-primary-950">Reset your password</h1>
                                <p className="text-[16px] text-neutral-700">Enter the email on your account and we will send you a reset link</p>
                            </div>
                            <form onSubmit={handleSubmit((values) => requestResetMutation.mutate(values))} className="flex w-full flex-col gap-4">
                                <FormInput label="Email" type="email" error={errors.email?.message} {...register("email")} />

                                <ActionButton type="submit" variant="primary" size="lg" disabled={requestResetMutation.isPending}>
                                    {requestResetMutation.isPending ? "Sending..." : "Send reset link"}
                                </ActionButton>

                                <Link to="/candidate/signin" className="flex items-center justify-center gap-1.5 text-base text-primary-500">
                                    <ArrowLeft className="size-4" />
                                    Back to log in
                                </Link>
                            </form>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
