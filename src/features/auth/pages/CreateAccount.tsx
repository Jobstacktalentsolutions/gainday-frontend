import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Button } from "@base-ui/react";
import { FormInput } from "@/components/form/FormInput";
import AuthCard from "../component/AuthCard";
import PasswordInput from "../component/passwordInput";
import { AuthCheckboxRow } from "../component/AuthCheckBox";
import { AuthDivider } from "../component/AuthDivider";
import SocialAuthButton from "../component/SocialAuthButton";
import AuthSwitchLink from "../component/AuthSwitchLink";
import { createAccountSchema, type CreateAccountFormValues } from "../schemas/createAccountSchema";


const CreateAccount = () => {
    const navigate = useNavigate();
    const [agreed, setAgreed] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateAccountFormValues>({
        resolver: zodResolver(createAccountSchema),
    })

    const signupMutation = useMutation({
        mutationFn: (values: CreateAccountFormValues) =>
            apiClient.post("/auth/signup", values),
        onSuccess: () => navigate("/dashboard"),
    })

    const onSubmit = (values: CreateAccountFormValues) => {
        signupMutation.mutate({ ...values, agreedToTerms: agreed })
    }

    return (
        <AuthCard
            title="Create your Employer Account"
            subtitle="Post your first job free. No card required."
            open={true}
            onOpenChange={(open) => !open && navigate("/")}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="flex w-full flex-col gap-4"
            >
                <FormInput
                    label="full name"
                    placeholder="Amara Chukwu"
                    required
                    {...register("fullName")}
                    error={errors.fullName?.message}
                />

            </form>

        </AuthCard>
    );
}

export default CreateAccount;