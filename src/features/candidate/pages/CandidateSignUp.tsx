import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PublicNavbar } from "@/features/candidate/components/PublicNavbar";
import { FormInput } from "@/components/form/FormInput";
import { ActionButton } from "@/components/ui/ActionButton";
import { PasswordInput } from "../components/PasswordInput";
import SocialAuthButton from "@/features/auth/component/SocialAuthButton";
import { candidateSignUpSchema, type CandidateSignUpValues } from "../auth/schema";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/authStore";
import { mockCandidateSignUp } from "../auth/mockCandidateAuth";


export default function CandidateSignUp() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect");

    const signUpMutation = useMutation({
        mutationFn: mockCandidateSignUp,
        onSuccess: (res) => {
            useAuthStore.getState().setAuth(res.data.access_token, res.data.user);
            navigate(redirect ?? "/job-board");
        }
    });


    const { register, handleSubmit, formState: { errors, isValid }, } =
        useForm<CandidateSignUpValues>({
            resolver: zodResolver(candidateSignUpSchema),
            mode: "onChange",
            defaultValues: {
                fullName: "",
                email: "",
                password: "",
                confirmPassword: "",
                agreedToTerms: false
            },
        });

    async function onSubmit(values: CandidateSignUpValues) {
        signUpMutation.mutate(values);
    }

    const signInHref = redirect ? `/candidate/signin?redirect=${encodeURIComponent(redirect)}` : "/candidate/signin";

    return (
        <div className="min-h-screen w-full bg-neutral-50">
            <PublicNavbar />
            <main className="flex w-full justify-center px-4 pt-55 pb-12">
                <div className="w-full max-w-120 rounded-2xl bg-white px-10 py-12 shadow-sm">
                    <div className="mb-8 flex flex-col items-center gap-2 text-center">
                        <h1 className="text-[32px] leading-9.5 tracking-[-0.32px] text-primary-950">Sign up to apply</h1>
                        <p className="text-[16px] text-neutral-700">
                            Track your Capability Score across every application & see your full results and feedback anytime
                        </p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
                        <FormInput label="Full name" placeholder="Amara Chukwu" error={errors.fullName?.message} {...register("fullName")} />
                        <FormInput label="Email" type="email" placeholder="amara@yourcompany.com" error={errors.email?.message} {...register("email")} />
                        <PasswordInput label="Password" placeholder="At least 8 characters" error={errors.password?.message} {...register("password")} />
                        <PasswordInput label="Confirm Password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />

                        <label className="flex items-start gap-2 text-xs text-primary-950">
                            <input type="checkbox" className="mt-0.5 size-5 rounded-[6px] border border-neutral-200" {...register("agreedToTerms")} />
                            <span>
                                I agree to the <a href="/terms" className="underline">Terms &amp; Conditions</a> and{" "}
                                <a href="/privacy" className="underline">Privacy Policy</a>
                            </span>
                        </label>
                        {errors.agreedToTerms && <p role="alert" className="text-sm text-error-500">{errors.agreedToTerms.message}</p>}

                        <ActionButton type="submit" variant="primary" size="lg" disabled={!isValid || isSubmitting}>
                            {signUpMutation.isPending ? "Creating account..." : "Create account"}
                        </ActionButton>

                        <div className="flex items-center gap-2.5 text-[16px] text-neutral-400">
                            <span className="h-px flex-1 bg-neutral-200" /> or <span className="h-px flex-1 bg-neutral-200" />
                        </div>

                        <SocialAuthButton label="Sign up with Google" />
                        <p className="text-center text-[16px] text-neutral-700">
                            Already have an account?{" "}
                            <Link to={signInHref} className="text-primary-500">Sign in</Link>
                        </p>
                    </form>
                </div>
            </main>
        </div>
    )



}