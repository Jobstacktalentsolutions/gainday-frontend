import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PublicNavbar } from "@/features/candidate/components/PublicNavbar";
import { FormInput } from "@/components/form/FormInput";
import { ActionButton } from "@/components/ui/ActionButton";
import { PasswordInput } from "../components/PasswordInput";
import { candidateSignInSchema, type CandidateSignInValues } from "../auth/schema";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/authStore";
import { apiClient, getBaseURL } from "@/lib/api/client";
import { AuthDivider } from "@/features/auth/component/AuthDivider";
import SocialAuthButton from "@/features/auth/component/SocialAuthButton";



export default function CandidateSignIn() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect");

    const signInMutation = useMutation({
        mutationFn: (values: CandidateSignInValues) =>
            apiClient.post("/auth/login", values),
        onSuccess: (res) => {
            useAuthStore.getState().setAuth(res.data.access_token, res.data.user);
            if (!res.data.isEmailVerified) {
                navigate("/candidate/verify-email");
            } else {
                navigate(redirect ?? "/job-board");
            }
        }
    })

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<CandidateSignInValues>({
        resolver: zodResolver(candidateSignInSchema),
        mode: "onChange",
        defaultValues: { email: "", password: "" },
    });

    const email = watch("email");

    async function onSubmit(values: CandidateSignInValues) {
        signInMutation.mutate(values);
    }

    const signUpHref = redirect ? `/candidate/signup?redirect=${encodeURIComponent(redirect)}` : "/candidate/signup";
    const forgotPasswordHref = email
        ? `/candidate/forgot-password?email=${encodeURIComponent(email)}`
        : "/candidate/forgot-password";

    return (
        <div className="min-h-screen w-full bg-neutral-50">
            <PublicNavbar />
            <main className="flex w-full justify-center px-4 pt-55 pb-12">
                <div className="w-full max-w-120 rounded-2xl bg-white px-10 py-12 shadow-sm">
                    <div className="mb-8 flex flex-col items-center gap-2 text-center">
                        <h1 className="text-[32px] leading-9.5 tracking-[-0.32px] text-primary-950">Log in to Gainday</h1>
                        <p className="text-[16px] text-neutral-700">Get discovered by other employers on Gainday</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
                        <FormInput label="Email" type="email" error={errors.email?.message} {...register("email")} />
                        <div className="flex flex-col items-end gap-4">
                            <PasswordInput label="Password" error={errors.password?.message} {...register("password")} />
                            <Link to={forgotPasswordHref} className="text-[16px] text-primary-500">
                                Forgot Password?
                            </Link>
                        </div>

                        {signInMutation.isError && (
                            <p role="alert" className="text-center text-sm text-error-600">
                                Incorrect email or password
                            </p>
                        )}

                        <ActionButton type="submit" variant="primary" size="lg" disabled={!isValid || signInMutation.isPending}>
                            {signInMutation.isPending ? "Logging in..." : "Log in"}
                        </ActionButton>

                        <AuthDivider />
                        <SocialAuthButton
                            label="Sign in with Google"
                            onClick={() => {
                                window.location.href = `${getBaseURL()}/auth/google?role=JOB_SEEKER`;
                            }}
                        />

                        <p className="text-center text-[16px] text-neutral-700">
                            New to Gainday?{" "}
                            <Link to={signUpHref} className="text-primary-500">Create an account</Link>
                        </p>
                    </form>
                </div>
            </main>
        </div>
    );

}
