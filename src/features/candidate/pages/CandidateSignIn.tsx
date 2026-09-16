import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PublicNavbar } from "@/features/candidate/components/PublicNavbar";
import { FormInput } from "@/components/form/FormInput";
import { ActionButton } from "@/components/ui/ActionButton";
import { PasswordInput } from "../components/PasswordInput";
import { candidateSignInSchema, type CandidateSignInValues } from "../schemas";
import { useCandidateAuth } from "../hooks/useCandidateAuth";


export default function CandidateSignIn() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect");
    const { isSubmitting, signIn } = useCandidateAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<CandidateSignInValues>({
        resolver: zodResolver(candidateSignInSchema),
        mode: "onChange",
        defaultValues: { email: "", password: "" },
    });

    async function onSubmit(values: CandidateSignInValues) {
        await signIn(values);
        navigate(redirect ?? "/job-board");
    }

    const signUpHref = redirect ? `/candidate/signup?redirect=${encodeURIComponent(redirect)}` : "/candidate/signup";

    return (
        <div className="min-h-screen w-full bg-neutral-50">
            <PublicNavbar />
            <main className="mx-auto flex w-full max-w-[566px] flex-col items-center gap-[60px] px-6 pb-20 pt-[175px]">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-[32px] leading-[38px] tracking-[-0.32px] text-primary-950">Log in to Gainday</h1>
                    <p className="text-[16px] text-neutral-700">Get discovered by other employers on Gainday</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
                    <FormInput label="Email" type="email" error={errors.email?.message} {...register("email")} />
                    <div className="flex flex-col items-end gap-4">
                        <PasswordInput label="Password" error={errors.password?.message} {...register("password")} />
                        {/* TODO: /candidate/forgot-password not built yet — stub link */}
                        <Link to="/candidate/forgot-password" className="text-[16px] text-primary-500">
                            Forgot Password?
                        </Link>
                    </div>
                    <ActionButton type="submit" variant="primary" size="lg" disabled={!isValid || isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Log in"}
                    </ActionButton>

                    <div className="flex items-center gap-2.5 text-[16px] text-neutral-200">
                        <span className="h-px flex-1 bg-neutral-200" /> or <span className="h-px flex-1 bg-neutral-200" />
                    </div>

                    <ActionButton type="button" variant="outline" size="lg" disabled>
                        Sign in with Google
                    </ActionButton>

                    <p className="text-center text-[16px] text-neutral-700">
                        New to Gainday?{" "}
                        <Link to={signUpHref} className="text-primary-500">Create an account</Link>
                    </p>
                </form>
            </main>
        </div>

    );

}