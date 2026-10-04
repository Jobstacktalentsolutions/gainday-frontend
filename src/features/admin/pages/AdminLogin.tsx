import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, CheckCircle2, KeyRound, RefreshCw, ShieldCheck } from "lucide-react";
import { type AdminLoginFormValues, adminLoginSchema } from "../schemas/loginSchema";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/features/auth/store/authStore";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/FormInput";
import spinner from "@/assets/Spinner.svg";
import brandLogo2 from "@/assets/gainday icon.svg";

interface AdminLoginInitiateResponse {
  requires2FA: boolean;
  challengeToken: string;
  emailMasked: string;
}

interface AdminVerify2faResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    profileId?: string;
    fullName?: string;
  };
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [challengeToken, setChallengeToken] = useState<string>("");
  const [emailMasked, setEmailMasked] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [resendSuccess, setResendSuccess] = useState<boolean>(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
  });

  // Step 1: Initiate Admin Login
  const loginMutation = useMutation({
    mutationFn: async (values: AdminLoginFormValues): Promise<AdminLoginInitiateResponse> => {
      const res = await apiClient.post<AdminLoginInitiateResponse>("/auth/admin/login", values);
      return res.data;
    },
    onSuccess: (data) => {
      setErrorMessage(null);
      setChallengeToken(data.challengeToken);
      setEmailMasked(data.emailMasked);
      setStep("2fa");
      setOtp(["", "", "", "", "", ""]);
      setResendCountdown(60);
      setCanResend(false);
      setResendSuccess(false);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        "Invalid email or password. Please make sure you have admin privileges.";
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  // Step 2: Verify 2FA OTP
  const verifyMutation = useMutation({
    mutationFn: async (otpCode: string): Promise<AdminVerify2faResponse> => {
      const res = await apiClient.post<AdminVerify2faResponse>("/auth/admin/verify-2fa", {
        challengeToken,
        otp: otpCode,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.user?.role !== "ADMIN") {
        setErrorMessage("Access denied. This account does not have administrator privileges.");
        useAuthStore.getState().clearAuth();
        return;
      }
      setErrorMessage(null);
      useAuthStore.getState().setAuth(data.access_token, data.user);
      navigate("/admin/dashboard");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        "Invalid verification code. Please check your email and try again.";
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  // Resend 2FA OTP
  const resendMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/auth/admin/resend-2fa", {
        challengeToken,
      });
      return res.data;
    },
    onSuccess: () => {
      setErrorMessage(null);
      setResendSuccess(true);
      setResendCountdown(60);
      setCanResend(false);
      setTimeout(() => setResendSuccess(false), 4000);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to resend code. Please try again.";
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  // Countdown timer for 2FA resend
  useEffect(() => {
    if (step !== "2fa" || resendCountdown <= 0) {
      if (resendCountdown === 0) setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, resendCountdown]);

  // Focus first OTP input when transitioning to 2FA step
  useEffect(() => {
    if (step === "2fa") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  const onCredentialsSubmit = (values: AdminLoginFormValues) => {
    setErrorMessage(null);
    loginMutation.mutate(values);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits are entered, auto-submit
    const fullOtp = newOtp.join("");
    if (fullOtp.length === 6 && !newOtp.includes("")) {
      setErrorMessage(null);
      verifyMutation.mutate(fullOtp);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split("");
    setOtp(digits);
    otpInputRefs.current[5]?.focus();
    setErrorMessage(null);
    verifyMutation.mutate(pastedData);
  };

  const onOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the verification code.");
      return;
    }
    setErrorMessage(null);
    verifyMutation.mutate(code);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-y-8 bg-background-admin px-4 py-8">
      <div>
        <img src={brandLogo2} className="h-12 w-auto" alt="Gainday logo" />
      </div>

      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-sm border border-neutral-100">
        {step === "credentials" ? (
          <div>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-foreground-admin tracking-tight">
                Gainday Admin Portal
              </h1>
              <p className="text-muted-foreground text-sm">
                Sign in with administrator credentials to manage the platform
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onCredentialsSubmit)}
              noValidate
              className="mt-6 space-y-5"
            >
              <FormInput
                label="Admin Email"
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
                placeholder="••••••••"
                required
                autoComplete="current-password"
                error={errors.password?.message}
                {...register("password")}
              />

              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                >
                  <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-x-2 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 rounded-lg shadow-sm transition-all"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending && (
                  <img src={spinner} alt="spinner" className="w-4 h-4 animate-spin" />
                )}
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  setStep("credentials");
                  setErrorMessage(null);
                }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground-admin">
                  Two-Factor Authentication
                </h1>
                <p className="text-xs text-muted-foreground">
                  Security verification required
                </p>
              </div>
            </div>

            <p className="text-sm text-neutral-600 mb-6">
              We sent a 6-digit security code to{" "}
              <span className="font-medium text-neutral-900">{emailMasked}</span>. Enter the code below to complete your login.
            </p>

            <form onSubmit={onOtpSubmit} className="space-y-6">
              <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-xl font-bold text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-lg focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                  />
                ))}
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                >
                  <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {resendSuccess && (
                <div
                  role="status"
                  className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm"
                >
                  <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0" />
                  <span>New verification code sent successfully!</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-x-2 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 rounded-lg shadow-sm transition-all"
                disabled={verifyMutation.isPending || otp.join("").length !== 6}
              >
                {verifyMutation.isPending && (
                  <img src={spinner} alt="spinner" className="w-4 h-4 animate-spin" />
                )}
                {verifyMutation.isPending ? "Verifying Code..." : "Verify & Sign In"}
              </Button>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-neutral-100">
                <span className="flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5" /> Code expires in 10m
                </span>

                <button
                  type="button"
                  disabled={!canResend || resendMutation.isPending}
                  onClick={() => resendMutation.mutate()}
                  className={`flex items-center gap-1 font-medium transition-colors ${
                    canResend
                      ? "text-primary-600 hover:text-primary-700 cursor-pointer"
                      : "text-neutral-400 cursor-not-allowed"
                  }`}
                >
                  <RefreshCw
                    className={`w-3 h-3 ${resendMutation.isPending ? "animate-spin" : ""}`}
                  />
                  {canResend ? "Resend code" : `Resend in ${resendCountdown}s`}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <p className="text-xs text-neutral-400">
        Protected by Gainday Security • Two-Factor Authentication Enforced
      </p>
    </div>
  );
};

AdminLogin.displayName = "AdminLogin";
export default AdminLogin;