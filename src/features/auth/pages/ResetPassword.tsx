import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { ActionButton } from "@/components/ui/ActionButton";
import AuthCard from "../component/AuthCard";
import PasswordInput from "../component/passwordInput";
import { resetPasswordSchema, type resetPasswordFormValues } from "../schemas/resetPasswordSchema";


const ResetPassWord = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<resetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema)
    })

    const resetMutation = useMutation({
        mutationFn: (values: resetPasswordFormValues) =>
            apiClient.post("/auth/reset-password", { ...values, token }),
        onSuccess: () => setSuccess(true),
    })

    //renders this if password reset was successful
    if (success) {
        return (
            <AuthCard
                title=""
                subtitle=""
                open={true}
                onOpenChange={(open) => !open && navigate("/")}
            >
                <div className="flex w-full flex-col items-center gap-6 text-center">
                    <p className="text-2xl text-primary-950">
                        You successfully reset your password
                    </p>
                    <ActionButton
                        className="w-full"
                        onClick={() => navigate("/employer/signin")}
                    >
                        Sign in
                    </ActionButton>

                </div>

            </AuthCard>
        )
    }
}

export default ResetPassWord;