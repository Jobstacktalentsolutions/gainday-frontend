import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/features/auth/store/authStore";
import { PublicNavbar } from "@/features/candidate/components/PublicNavbar";
import { ActionButton } from "@/components/ui/ActionButton";
import successAnimation from "@/assets/successAnimation.gif";
import spinner from "@/assets/Spinner.svg";

export default function CandidateVerifyEmail() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const verified = searchParams.get("verified");
    const error = searchParams.get("error");
    const redirect = searchParams.get("redirect");
    const [isVerifying, setIsVerifying] = useState(false);

    const { mutate: syncUser } = useMutation({
        mutationFn: () => apiClient.get("/auth/me"),
        onSuccess: (res) => {
            const { user } = res.data;
            useAuthStore.getState().setAuth(useAuthStore.getState().accessToken, user);
            setIsVerifying(false);
        },
        onError: () => setIsVerifying(false),
    });

    useEffect(() => {
        if (verified === "true") {
            setIsVerifying(true);
            const timer = setTimeout(() => syncUser(), 1000);
            return () => clearTimeout(timer);
        }
    }, [verified, syncUser]);

    let content: React.ReactNode;

    if (verified === "true" && !isVerifying) {
        content = (
            <div className="flex w-full flex-col items-center gap-6 text-center">
                <img src={successAnimation} alt="Email Verified" className="h-32 w-32" />
                <div>
                    <p className="mb-2 text-2xl font-bold text-primary-950">Email Verified! 🎉</p>
                    <p className="text-neutral-700">
                        Thank you for verifying your email. Your account is now fully activated and you can start applying to jobs.
                    </p>
                </div>
                <ActionButton
                    className="w-full py-3 text-base"
                    onClick={() => navigate(redirect ?? "/job-board")}
                >
                    Browse Jobs
                </ActionButton>
            </div>
        );
    } else if (isVerifying) {
        content = (
            <div className="flex w-full flex-col items-center gap-6 text-center">
                <img src={spinner} alt="Loading" className="h-10 w-10 animate-spin" />
                <p className="text-lg text-neutral-700">Verifying your email...</p>
            </div>
        );
    } else if (error || verified === "false") {
        content = (
            <div className="flex w-full flex-col items-center gap-6 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                    <span className="text-4xl">❌</span>
                </div>
                <div>
                    <p className="mb-2 text-2xl font-bold text-primary-950">Verification Failed</p>
                    <p className="mb-4 text-sm text-neutral-700">
                        The verification link is invalid or has expired. Check your email inbox for a new verification link.
                    </p>
                </div>
                <div className="flex w-full flex-col gap-3 pt-4">
                    <ActionButton className="w-full py-3 text-base" onClick={() => navigate("/candidate/signin")}>
                        Sign In
                    </ActionButton>
                    <button
                        onClick={() => navigate("/candidate/signup")}
                        className="w-full rounded-lg border-2 border-primary-600 py-3 text-base font-semibold text-primary-600 transition-colors hover:bg-primary-50"
                    >
                        Create New Account
                    </button>
                </div>
            </div>
        );
    } else {
        content = (
            <div className="flex w-full flex-col items-center gap-6 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-100">
                    <span className="text-4xl">📧</span>
                </div>
                <div>
                    <p className="mb-2 text-2xl font-bold text-primary-950">Check Your Email</p>
                    <p className="mb-4 text-neutral-700">We've sent a verification link to your email address.</p>
                    <p className="text-sm text-neutral-500">Click the link in the email to verify your account and get started.</p>
                </div>
                <div className="flex w-full flex-col gap-3 pt-4">
                    <p className="text-xs text-neutral-500">Link expires in 24 hours</p>
                    <button
                        onClick={() => navigate("/candidate/signin")}
                        className="w-full rounded-lg border-2 border-primary-600 py-3 text-base font-semibold text-primary-600 transition-colors hover:bg-primary-50"
                    >
                        Back to Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-neutral-50">
            <PublicNavbar />
            <main className="flex w-full justify-center px-4 pt-55 pb-12">
                <div className="w-full max-w-120 rounded-2xl bg-white px-10 py-12 shadow-sm">
                    {content}
                </div>
            </main>
        </div>
    );
}
