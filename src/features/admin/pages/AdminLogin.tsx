import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { type AdminLoginFormValues, adminLoginSchema } from "../schemas/loginSchema";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/features/auth/store/authStore";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/FormInput";
import spinner from "@/assets/Spinner.svg";
import brandLogo2 from "@/assets/gainday icon.svg";


const AdminLogin = () => {

    const navigate = useNavigate();
    const [notAdminError, setNotAdminError] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AdminLoginFormValues>({
        resolver: zodResolver(adminLoginSchema),
    })

    const loginMutation = useMutation({
        mutationFn: (values: AdminLoginFormValues) =>
            apiClient.post("/auth/login", values),
        onSuccess: (res) => {
            if (res.data.user?.role !== "ADMIN") {
                setNotAdminError(true);
                useAuthStore.getState().clearAuth();
                return;
            }
            setNotAdminError(false);
            useAuthStore.getState().setAuth(res.data.access_token, res.data.user);
            navigate("/admin/dashboard");
        }
    })

    const onSubmit = (values: AdminLoginFormValues) => {
        loginMutation.mutate(values);
    }

    return (
        <div className="flex flex-col min-h-screen items-center justify-center gap-y-10 bg-background-admin ">
            <div>
                <img
                    src={brandLogo2}
                    className="h-15 "
                    alt="gainday logo"
                />
            </div>
            <div className="w-100 p-10 space-y-5 bg-white rounded-md">
                <h1 className="text-2xl font-semibold text-foreground-admin">
                    Gainday Admin
                </h1>
                <p className="mt-1 text-muted-foreground text-sm">
                    Sign in to manage jobs, users, and moderation
                </p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="mt-6 space-y-5"
                >

                    <FormInput
                        label="Email address"
                        type="email"
                        placeholder="admin@gainday.com"
                        required
                        autoComplete="email"
                        error={errors.email?.message}
                        {...register("email")}
                    />

                    <FormInput
                        label="Password"
                        type="password"
                        placeholder="********"
                        required
                        autoComplete="current-password"
                        error={errors.password?.message}
                        {...register("password")}
                    />

                    {(loginMutation.isError || notAdminError) && (
                        <p role="alert"
                            className="flex items-center gap-1.5 text-sm text-destructive">
                            <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                            {notAdminError
                                ? "This account does not have admin access."
                                : "Invalid email or password. Please try again"}
                        </p>
                    )}

                    <Button type="submit" className="w-full flex items-center justify-center gap-x-2 bg-primary-500 hover:bg-primary-400 hover:opacity-80" disabled={isSubmitting}>
                        {isSubmitting && (
                            <span>
                            <img
                                src={spinner}
                                alt="spinner"
                                className="w-4 h-4 animate-spin"
                            />
                        </span>
                        )}
                        {isSubmitting ? "Signing in ..." : "Sign In"}
                    </Button>
                </form>

            </div>

        </div>
    );
}

AdminLogin.displayName = "AdminLogin";
export default AdminLogin;