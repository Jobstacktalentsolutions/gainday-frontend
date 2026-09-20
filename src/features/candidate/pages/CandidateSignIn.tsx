import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiClient, getBaseURL } from "@/lib/api/client";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ActionButton } from "@/components/ui/ActionButton";
import { FormInput } from "@/components/form/FormInput";
import { AuthDivider } from "@/features/auth/component/AuthDivider";
import SocialAuthButton from "@/features/auth/component/SocialAuthButton";
import AuthSwitchLink from "@/features/auth/component/AuthSwitchLink";
import AuthCard from "@/features/auth/component/AuthCard";
import PasswordInput from "@/features/auth/component/passwordInput";
import spinner from "@/assets/Spinner.svg";
import { candidateSignInSchema, type CandidateSignInValues } from "../auth/schema";



const CandidateSignIn = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<CandidateSignInValues>({
        resolver: zodResolver(candidateSignInSchema)
    })

    const email = watch("email");

    const signInMutation = useMutation({
        mutationFn: (values: CandidateSignInValues) =>
            apiClient.post("/auth/login", values),
        onSuccess: (res) => {
            useAuthStore.getState().setAuth(res.data.access_token, res.data.user)
            if (!res.data.isEmailVerified) {
                navigate("/candidate/verify-email")
            } else {
                navigate(redirect ?? "/job-board")
            }
        }
    })

    const signUpHref = redirect ? `/candidate/signup?redirect=${encodeURIComponent(redirect)}` : "/candidate/signup";
    const forgotPasswordHref = email
        ? `/candidate/forgot-password?email=${encodeURIComponent(email)}`
        : "/candidate/forgot-password";

    return (
        <AuthCard
            title="Log in to Gainday"
            subtitle="Get discovered by other employers on Gainday"
        >
            <form
                onSubmit={handleSubmit((values) => signInMutation.mutate(values))}
                noValidate
                className="flex w-full flex-col gap-4"
            >
                <FormInput
                    label="Email"
                    type="email"
                    required
                    autoComplete="email"
                    {...register("email")}
                    error={errors.email?.message}
                />
                <div className="flex flex-col gap-2">
                    <PasswordInput
                        label="Password"
                        required
                        autoComplete="current-password"
                        {...register("password")}
                        error={errors.password?.message}
                        className="w-full"
                    />
                    <div className="w-full flex justify-end ">
                        <Link
                            to={forgotPasswordHref}
                            className="text-base text-primary-500 hover:text-primary-600  transition-colors duration-300 delay-100"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                </div>

                {
                    signInMutation.isError && (
                        <p
                            role="alert"
                            className="text-center text-sm text-error-600"
                        >
                            Incorrect email or password
                        </p>
                    )
                }

                <ActionButton
                    type="submit"
                    className="w-full py-6 lg:text-base"
                    disabled={signInMutation.isPending}
                >
                    {
                        signInMutation.isPending
                            ? (<span className="flex gap-x-3 items-center justify-center">

                                <img
                                    src={spinner}
                                    alt="spinner"
                                    className="w-4 h-4 animate-spin"
                                />
                                <span>Signing in ...</span>
                            </span>)
                            : (<span>Log in</span>)
                    }
                </ActionButton>

                <AuthDivider />
                <SocialAuthButton
                    label="Sign in with Google"
                    onClick={() => {
                        window.location.href = `${getBaseURL()}/auth/google?role=JOB_SEEKER`
                    }}
                />
                <AuthSwitchLink
                    prompt="New to Gainday?"
                    linkText="Create an account"
                    to={signUpHref}
                />

            </form>

        </AuthCard>
    );
}


export default CandidateSignIn;
