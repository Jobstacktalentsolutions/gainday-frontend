import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiClient, getBaseURL } from "@/lib/api/client";
import { useAuthStore } from "../store/authStore";
import { FormInput } from "@/components/form/FormInput";
import AuthCard from "../component/AuthCard";
import PasswordInput from "../component/passwordInput";
import { AuthCheckboxRow } from "../component/AuthCheckBox";
import { AuthDivider } from "../component/AuthDivider";
import SocialAuthButton from "../component/SocialAuthButton";
import AuthSwitchLink from "../component/AuthSwitchLink";
import { createAccountSchema, type CreateAccountFormValues } from "../schemas/createAccountSchema";
import { ActionButton } from "@/components/ui/ActionButton";
import spinner from "@/assets/Spinner.svg";


const CreateAccount = () => {
    const navigate = useNavigate();
    const [agreed, setAgreed] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CreateAccountFormValues>({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {
            fullName: "",
            email: "",
            companyName: "",
            password: "",
            confirmPassword: "",
            agreedToTerms: false,
        }
    })

    const signupMutation = useMutation({
        mutationFn: (values: CreateAccountFormValues) =>
            apiClient.post("/auth/signup", values),
        onSuccess: (res) => {
            useAuthStore.getState().setAuth(res.data.access_token, res.data.user)
            navigate("/employer/verify-email")
        },
    })

    const onSubmit = (values: CreateAccountFormValues) => {
        signupMutation.mutate({ ...values, agreedToTerms: agreed })
    }

    return (
        <AuthCard
            title="Create your Employer Account"
            subtitle="Post your first job free. No card required."
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="flex w-full flex-col gap-4"
            >
                <FormInput
                    label="Full name"
                    placeholder="Amara Chukwu"
                    required
                    {...register("fullName")}
                    error={errors.fullName?.message}
                />

                <FormInput
                    label="Work Email"
                    type="email"
                    placeholder="amara@yourcompany.com"
                    required
                    autoComplete="email"
                    {...register("email")}
                    error={errors.email?.message}
                />
                <FormInput
                    label="Company's Name"
                    placeholder="e.g Amara Capital"
                    required
                    {...register("companyName")}
                    error={errors.companyName?.message}
                />
                <PasswordInput
                    label="password"
                    placeholder="At least 8 characters"
                    required
                    showChecklist
                    autoComplete="new-password"
                    {...register("password")}
                    error={errors.password?.message}
                />
                <PasswordInput
                    label="Confirm Password"
                    required
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                />
                <AuthCheckboxRow
                    checked={agreed}
                    onCheckedChange={(checked) => {
                        setAgreed(checked);
                        setValue("agreedToTerms", checked, { shouldValidate: true });
                    }}
                    error={errors.agreedToTerms?.message}
                />

                <ActionButton
                    type="submit"
                    className="w-full py-6"
                    disabled={signupMutation.isPending}
                >
                    {
                        signupMutation.isPending
                            ? (<span className="flex gap-x-3 items-center justify-center">

                                <img
                                    src={spinner}
                                    alt="spinner"
                                    className="w-4 h-4 animate-spin"
                                />
                                <span>Creating account ...</span>
                            </span>)
                            : (<span>Create account</span>)
                    }

                </ActionButton>
                <AuthDivider />
                <SocialAuthButton
                    label="Sign up with Google"
                    onClick={() => {
                        window.location.href = `${getBaseURL()}/auth/google`
                    }}
                />
                <AuthSwitchLink
                    prompt="Already have an account?"
                    linkText="Sign in"
                    to="/employer/signin"
                />

            </form>

        </AuthCard>
    );
}

export default CreateAccount;