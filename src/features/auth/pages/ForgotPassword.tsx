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
    const navigate = useNavigate()
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
            subtitle={`We sent a password reset link to ${sentTo}`}
            open={true}
            onOpenChange={(open) => !open && navigate("/")}
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
                Wrong email? <span className="text-primary-50">Go back</span>
            </button>

        </AuthCard>
    );
}

export default ForgotPassword;