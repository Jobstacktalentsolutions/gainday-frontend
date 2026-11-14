import { isAxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams, Link, Navigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "../store/authStore";
import { useCurrentUser } from "../hooks/useCurrentUser";
import AppLoader from "@/components/ui/AppLoader";
import { ActionButton } from "@/components/ui/ActionButton";
import { FormInput } from "@/components/form/FormInput";
import { AuthDivider } from "../component/AuthDivider";
import { GoogleSignIn } from "../component/GoogleSignIn";
import { signInSchema, type signInFormValues } from "../schemas/signInSchema";
import AuthCard from "../component/AuthCard";
import PasswordInput from "../component/passwordInput";
import spinner from "@/assets/Spinner.svg";



const SignIn = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect");
    const { user, accessToken, isAuthenticated, isLoadingProfile } = useCurrentUser();

    const safeRedirect = redirect && redirect.startsWith("/") ? redirect : null;
    const defaultRoute = user?.role === "JOB_SEEKER" ? "/job-board" : "/employer/jobs";
    const target = safeRedirect ?? defaultRoute;

    useEffect(() => {
        if (isAuthenticated) {
            navigate(target, { replace: true });
        }
    }, [isAuthenticated, target, navigate]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<signInFormValues>({
        resolver: zodResolver(signInSchema)
    })

    const email = watch("email");

    const signInMutation = useMutation({
        mutationFn: (values: signInFormValues) =>
            apiClient.post("/auth/login", values),
        onSuccess: (res) => {
            const user = {
                ...res.data.user,
                isEmailVerified: res.data.user?.isEmailVerified ?? res.data.isEmailVerified ?? res.data.emailVerified ?? true,
                emailVerified: res.data.user?.emailVerified ?? res.data.emailVerified ?? res.data.isEmailVerified ?? true,
            };
            useAuthStore.getState().setAuth(res.data.access_token, user);
            navigate(target);
        },
        onError: (error) => {
            if (isAxiosError(error) && error.response?.status === 403) {
                const data = error.response.data as {
                    emailVerified?: boolean;
                    isEmailVerified?: boolean;
                    code?: string;
                    email?: string;
                } | undefined;
                if (data && (data.emailVerified === false || data.isEmailVerified === false || data.code === "EMAIL_NOT_VERIFIED")) {
                    const targetEmail = email || data.email || "";
                    const emailParam = targetEmail ? `?email=${encodeURIComponent(targetEmail)}` : "";
                    const redirectParam = redirect ? `${emailParam ? "&" : "?"}redirect=${encodeURIComponent(redirect)}` : "";
                    navigate(`/employer/verify-email${emailParam}${redirectParam}`, {
                        state: { email: targetEmail },
                    });
                    return;
                }
            }
        },
    })

    if (isAuthenticated) {
        return <Navigate to={target} replace />;
    }

    if (accessToken && isLoadingProfile) {
        return <AppLoader />;
    }

    const renderErrorMessage = () => {
        const data = (signInMutation.error as any)?.response?.data;
        const message = data?.message;
        const msgStr = Array.isArray(message) ? message[0] : message;
        if (typeof msgStr === "string" && msgStr.toLowerCase().includes("suspended")) {
            const supportUrl = `/support?email=${encodeURIComponent(email || "")}&topic=${encodeURIComponent("Account Suspension Appeal")}`;
            const parts = msgStr.split(/(contact support)/i);
            if (parts.length > 1) {
                return (
                    <span>
                        {parts.map((part, idx) =>
                            part.toLowerCase() === "contact support" ? (
                                <Link
                                    key={idx}
                                    to={supportUrl}
                                    className="underline font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                                >
                                    {part}
                                </Link>
                            ) : (
                                part
                            )
                        )}
                    </span>
                );
            }
            return (
                <span>
                    {msgStr}{" "}
                    <Link
                        to={supportUrl}
                        className="underline font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                        Contact support
                    </Link>
                </span>
            );
        }
        return "Incorrect email or password";
    };

    return (
        <AuthCard
            title="Employer log in"
            subtitle="Review applications and manage job posts."
        >
            <form
                onSubmit={handleSubmit((values) => signInMutation.mutate(values))}
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
                            to={email ? `/employer/forgot-password?email=${encodeURIComponent(email)}` : "/employer/forgot-password"}
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
                            {renderErrorMessage()}
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
                            : (<span>Sign in</span>)
                    }
                </ActionButton>

                <AuthDivider />
                <GoogleSignIn redirect={redirect} />
                <p className="text-center text-base text-neutral-700">
                    New to Gainday?{" "}
                    <Link to="/employer/signup" className="text-primary-500">
                        Create an account
                    </Link>
                </p>

            </form>

        </AuthCard>
    );
}


export default SignIn;