import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { PublicNavbar } from "@/features/candidate/components/PublicNavbar";
import { ActionButton } from "@/components/ui/ActionButton";
import { PasswordInput } from "../components/PasswordInput";
import { resetPasswordSchema, type resetPasswordFormValues } from "@/features/auth/schemas/resetPasswordSchema";
import successAnimation from "@/assets/successAnimation.gif";

export default function CandidateResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<resetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const resetMutation = useMutation({
        mutationFn: (values: resetPasswordFormValues) =>
            apiClient.post("/auth/reset-password", { ...values, token }),
        onSuccess: () => setSuccess(true),
    });

    return (
        <div className="min-h-screen w-full bg-neutral-50">
            <PublicNavbar />
            <main className="flex w-full justify-center px-4 pt-55 pb-12">
                <div className="w-full max-w-120 rounded-2xl bg-white px-10 py-12 shadow-sm">
                    {success ? (
                        <div className="flex w-full flex-col items-center gap-6 text-center">
                            <img src={successAnimation} alt="Success" className="h-35 w-35" />
                            <p className="text-2xl text-primary-950">You successfully reset your password</p>
                            <ActionButton className="w-full" onClick={() => navigate("/candidate/signin")}>
                                Sign in
                            </ActionButton>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8 flex flex-col items-center gap-2 text-center">
                                <h1 className="text-[32px] leading-9.5 tracking-[-0.32px] text-primary-950">Change Password</h1>
                                <p className="text-[16px] text-neutral-700">Ensure your new password is different from the old password</p>
                            </div>
                            <form onSubmit={handleSubmit((values) => resetMutation.mutate(values))} className="flex w-full flex-col gap-4">
                                <PasswordInput
                                    label="Create New Password"
                                    showChecklist
                                    error={errors.password?.message}
                                    {...register("password")}
                                />
                                <PasswordInput
                                    label="Confirm Password"
                                    error={errors.confirmPassword?.message}
                                    {...register("confirmPassword")}
                                />

                                <ActionButton type="submit" variant="primary" size="lg" disabled={resetMutation.isPending}>
                                    {resetMutation.isPending ? "Updating..." : "Continue"}
                                </ActionButton>
                            </form>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
