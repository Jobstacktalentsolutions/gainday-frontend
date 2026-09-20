import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { apiClient, getBaseURL } from "@/lib/api/client";
import { useAuthStore } from "@/features/auth/store/authStore";
import { FormInput } from "@/components/form/FormInput";
import AuthCard from "@/features/auth/component/AuthCard";
import PasswordInput from "@/features/auth/component/passwordInput";
import { AuthCheckboxRow } from "@/features/auth/component/AuthCheckBox";
import { AuthDivider } from "@/features/auth/component/AuthDivider";
import SocialAuthButton from "@/features/auth/component/SocialAuthButton";
import AuthSwitchLink from "@/features/auth/component/AuthSwitchLink";
import { ActionButton } from "@/components/ui/ActionButton";
import spinner from "@/assets/Spinner.svg";
import { candidateSignUpSchema, type CandidateSignUpValues } from "../auth/schema";
import { useState } from "react";


const CandidateSignUp = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect");
    const [agreed, setAgreed] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CandidateSignUpValues>({
        resolver: zodResolver(candidateSignUpSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            agreedToTerms: false,
        }
    })

    const signUpMutation = useMutation({
        mutationFn: (values: CandidateSignUpValues) =>
            apiClient.post("/auth/register/candidate", values),
        onSuccess: (res) => {
            useAuthStore.getState().setAuth(res.data.access_token, res.data.user)
            navigate(redirect ? `/candidate/verify-email?redirect=${encodeURIComponent(redirect)}` : "/candidate/verify-email")
        },
    })

    const onSubmit = (values: CandidateSignUpValues) => {
        signUpMutation.mutate({ ...values, agreedToTerms: agreed })
    }

    const signInHref = redirect ? `/candidate/signin?redirect=${encodeURIComponent(redirect)}` : "/candidate/signin";

    return (
        <AuthCard
            title="Sign up to apply"
            subtitle="Track your Capability Score across every application & see your full results and feedback anytime"
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
                    label="Email"
                    type="email"
                    placeholder="amara@yourcompany.com"
                    required
                    autoComplete="email"
                    {...register("email")}
                    error={errors.email?.message}
                />
                <PasswordInput
                    label="Password"
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

                {signUpMutation.isError && (
                    <p role="alert" className="text-center text-sm text-error-600">
                        {(signUpMutation.error as AxiosError<{ message?: string }>)?.response?.data?.message ?? "Something went wrong. Please try again."}
                    </p>
                )}

                <ActionButton
                    type="submit"
                    className="w-full py-6"
                    disabled={signUpMutation.isPending}
                >
                    {
                        signUpMutation.isPending
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
                        window.location.href = `${getBaseURL()}/auth/google?role=JOB_SEEKER`
                    }}
                />
                <AuthSwitchLink
                    prompt="Already have an account?"
                    linkText="Sign in"
                    to={signInHref}
                />

            </form>

        </AuthCard>
    );
}

export default CandidateSignUp;
