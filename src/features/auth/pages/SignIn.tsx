import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { ActionButton } from "@/components/ui/ActionButton";
import { FormInput } from "@/components/form/FormInput";
import { AuthDivider } from "../component/AuthDivider";
import SocialAuthButton from "../component/SocialAuthButton";
import AuthSwitchLink from "../component/AuthSwitchLink";
import { signInSchema, type signInFormValues } from "../schemas/signInSchema";
import AuthCard from "../component/AuthCard";
import PasswordInput from "../component/passwordInput";
import spinner from "@/assets/Spinner.svg";



const SignIn = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<signInFormValues>({
        resolver: zodResolver(signInSchema)
    })

    const signInMutation = useMutation({
        mutationFn: (values: signInFormValues) =>
            apiClient.post("/auth/login", values),
        onSuccess: () => navigate("/dashboard")
    })

    return (
        <AuthCard
            title="Log in to Gainday"
            subtitle="Review submissions and manage job posts."
            open={true}
            onOpenChange={(open) => !open && navigate("/")}
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
                            to="/forgot-password"
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
                            : (<span>Sign in</span>)
                    }
                </ActionButton>

                <AuthDivider />
                <SocialAuthButton label="Sign in with Google" />
                <AuthSwitchLink
                    prompt="New to Gainday?"
                    linkText="Create an account"
                    to="/employer"
                />

            </form>

        </AuthCard>
    );
}


export default SignIn;