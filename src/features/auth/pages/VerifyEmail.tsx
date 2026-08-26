import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "../store/authStore";
import AuthCard from "../component/AuthCard";
import { ActionButton } from "@/components/ui/ActionButton";
import successAnimation from "@/assets/successAnimation.gif";
import spinner from "@/assets/Spinner.svg";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verified = searchParams.get("verified");
  const error = searchParams.get("error");
  const [isVerifying, setIsVerifying] = useState(false);

  // Sync user data after backend verifies
  const { mutate: syncUser } = useMutation({
    mutationFn: () => apiClient.get("/auth/me"),
    onSuccess: (res) => {
      const { user } = res.data;
      useAuthStore.getState().setAuth(
        useAuthStore.getState().accessToken,
        user
      );
      setIsVerifying(false);
    },
    onError: () => {
      setIsVerifying(false);
    },
  });

  // If verified=true, sync user and show success
  useEffect(() => {
    if (verified === "true") {
      setIsVerifying(true);
      const timer = setTimeout(() => {
        syncUser();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [verified, syncUser]);

  // Success state - user clicked email link and verified
  if (verified === "true" && !isVerifying) {
    return (
      <AuthCard title="" subtitle="">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <img
            src={successAnimation}
            alt="Email Verified"
            className="h-32 w-32"
          />
          <div>
            <p className="text-2xl font-bold text-primary-950 mb-2">
              Email Verified! 🎉
            </p>
            <p className="text-primary-600">
              Thank you for verifying your email. Your account is now fully
              activated and you can start posting jobs.
            </p>
          </div>
          <ActionButton
            className="w-full py-3 text-base"
            onClick={() => navigate("/employer/dashboard")}
          >
            Go to Dashboard
          </ActionButton>
        </div>
      </AuthCard>
    );
  }

  // Checking verification state
  if (isVerifying) {
    return (
      <AuthCard title="" subtitle="">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <img src={spinner} alt="Loading" className="w-10 h-10 animate-spin" />
          <p className="text-lg text-primary-600">Verifying your email...</p>
        </div>
      </AuthCard>
    );
  }

  // Error state - invalid or expired link
  if (error || verified === "false") {
    return (
      <AuthCard title="" subtitle="">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">❌</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-950 mb-2">
              Verification Failed
            </p>
            <p className="text-primary-700 mb-4 text-sm">
              The verification link is invalid or has expired. Check your email inbox for a new verification link.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full pt-4">
            <ActionButton
              className="w-full py-3 text-base"
              onClick={() => navigate("/employer/signin")}
            >
              Sign In
            </ActionButton>
            <button
              onClick={() => navigate("/employer/signup")}
              className="w-full py-3 text-base border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Create New Account
            </button>
          </div>
        </div>
      </AuthCard>
    );
  }

  // Default state - check your email (after signup)
  return (
    <AuthCard title="" subtitle="">
      <div className="flex w-full flex-col items-center gap-6 text-center">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">📧</span>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary-950 mb-2">
            Check Your Email
          </p>
          <p className="text-primary-600 mb-4">
            We've sent a verification link to your email address.
          </p>
          <p className="text-sm text-primary-500">
            Click the link in the email to verify your account and get started.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full pt-4">
          <p className="text-xs text-primary-500">
            Link expires in 24 hours
          </p>
          <button
            onClick={() => navigate("/employer/signin")}
            className="w-full py-3 text-base border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </AuthCard>
  );
};

export default VerifyEmail;
