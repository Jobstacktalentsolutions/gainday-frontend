import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Mail } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { ActionButton } from "@/components/ui/ActionButton";
import { FormInput } from "@/components/form/FormInput";
import AuthCard from "../component/AuthCard";
import { forgetPasswordSchema, type forgetPasswordFormValues } from "../schemas/forgetPasswordSchema";



const ForgotPassword = () => {
    // const navigate = useNavigate()
    const [sentTo, setSentTo] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<forgetPasswordFormValues>({ resolver: zodResolver(forgetPasswordSchema) });

    const requestResetMutation = useMutation({
        mutationFn: (values: forgetPasswordFormValues) =>
            apiClient.post("/auth/request-password-reset", values),
        onSuccess: (_res, values) => setSentTo(values.email),
    })

    if (sentTo) return (
        <AuthCard
            title="Check your inbox"
            subtitle={sentTo ? `We sent a password reset link to ${sentTo}` : ""}
        >
            <div className="flex w-full flex-col items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-xl bg-primary-50">
                    <Mail className="size-8 text-primary" />
                </div>
            </div>
            <ActionButton
                variant="outline"
                className="w-full"
                onClick={() => requestResetMutation.mutate({ email: sentTo })}
            >
                Resend Mail
            </ActionButton>
            <button
                onClick={() => setSentTo(null)}
                className="text-base text-neutral-700 "
            >
                Wrong email? <span className="text-primary-500">Go back</span>
            </button>

        </AuthCard>
    );

    return (
        <AuthCard
            title="Reset your password"
            subtitle="Enter the email on your account and we will send you a reset link"
        >
            <form
                onSubmit={handleSubmit((values) => requestResetMutation.mutate(values))}
                noValidate
                className="flex w-full flex-col gap-4"
            >
                <FormInput
                    label="Work Email"
                    type="email"
                    required
                    autoComplete="email"
                    {...register("email")}
                    error={errors.email?.message}
                />

                <ActionButton
                    type="submit"
                    className="w-full text-base"
                    disabled={requestResetMutation.isPending}
                >
                    {requestResetMutation.isPending
                        ? "Sending..."
                        : "Send reset link"
                    }

                </ActionButton>

                <Link
                    to="/employer/signin"
                    className="flex items-center justify-center gap-1.5 text-base text-primary-500"
                >
                    <ArrowLeft className="size-4" />
                    Back to log in
                </Link>

            </form>

        </AuthCard>
    )
}

export default ForgotPassword;