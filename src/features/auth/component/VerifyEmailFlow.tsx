import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Mail, MailWarning } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { ActionButton } from "@/components/ui/ActionButton";
import { FormInput } from "@/components/form/FormInput";
import successAnimation from "@/assets/successAnimation.gif";
import spinner from "@/assets/Spinner.svg";
import { useAuthStore } from "../store/authStore";
import AuthCard from "./AuthCard";
import AuthSwitchLink from "./AuthSwitchLink";

type Role = "candidate" | "employer";

const ROLE_CONFIG: Record<
  Role,
  { basePath: string; homePath: string; homeLabel: string; verifiedCopy: string }
> = {
  candidate: {
    basePath: "/candidate",
    homePath: "/job-board",
    homeLabel: "Browse jobs",
    verifiedCopy: "Your account is fully activated and you can start applying to jobs.",
  },
  employer: {
    basePath: "/employer",
    homePath: "/employer/jobs",
    homeLabel: "Go to dashboard",
    verifiedCopy: "Your account is fully activated and you can start posting jobs.",
  },
};

// Mirrors the backend's resend cooldown (RESEND_VERIFICATION_COOLDOWN_MS).
const RESEND_COOLDOWN_SECONDS = 60;
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

interface MeUser {
  email: string;
  isEmailVerified?: boolean;
}

const StatusIcon = ({ children, tone }: { children: ReactNode; tone: "primary" | "error" }) => (
  <div
    className={
      tone === "error"
        ? "mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-error-50 text-error-600"
        : "mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-primary-600"
    }
  >
    {children}
  </div>
);

interface ResendPanelProps {
  /** Known account email. When absent we ask for it. */
  email?: string;
  /** Start in cooldown when an email was only just sent (e.g. right after sign-up). */
  startInCooldown?: boolean;
}

const ResendPanel = ({ email, startInCooldown }: ResendPanelProps) => {
  const [typedEmail, setTypedEmail] = useState("");
  const [cooldown, setCooldown] = useState(startInCooldown ? RESEND_COOLDOWN_SECONDS : 0);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const target = email ?? typedEmail.trim();
  const canSubmit = EMAIL_PATTERN.test(target) && cooldown === 0;

  const resend = useMutation({
    mutationFn: (to: string) => apiClient.post("/auth/resend-verification", { email: to }),
    onSuccess: (_res, to) => {
      setSentTo(to);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (canSubmit && !resend.isPending) resend.mutate(target);
  };

  const label = resend.isPending
    ? "Sending..."
    : cooldown > 0
      ? `Resend in ${cooldown}s`
      : email
        ? "Resend verification email"
        : "Send verification email";

  return (
    <form onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-4">
      {!email && (
        <FormInput
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={typedEmail}
          onChange={(e) => setTypedEmail(e.target.value)}
        />
      )}

      <ActionButton
        type="submit"
        variant={email ? "outline" : "primary"}
        size="lg"
        disabled={!canSubmit || resend.isPending}
      >
        {resend.isPending && <img src={spinner} alt="" className="h-4 w-4 animate-spin" />}
        {label}
      </ActionButton>

      <div aria-live="polite" className="min-h-5 text-center text-sm">
        {resend.isError ? (
          <p role="alert" className="text-error-600">
            We couldn't send the email. Please try again in a moment.
          </p>
        ) : sentTo ? (
          <p className="text-neutral-700">
            If <span className="font-medium">{sentTo}</span> needs verifying, a new link is on its
            way. Check your spam or promotions folder too.
          </p>
        ) : null}
      </div>
    </form>
  );
};

const VerifyEmailFlow = ({ role }: { role: Role }) => {
  const config = ROLE_CONFIG[role];
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const accessToken = useAuthStore((state) => state.accessToken);
  const storedEmail = useAuthStore((state) => state.user?.email);

  const token = searchParams.get("token");
  const redirect = searchParams.get("redirect");
  const justSent = (location.state as { justSent?: boolean } | null)?.justSent === true;

  // Legacy params from the backend redirect flow used by older emails.
  const legacyVerified = searchParams.get("verified") === "true";
  const legacyFailed = searchParams.get("error") !== null || searchParams.get("verified") === "false";

  // Confirm the emailed token. A query (not an effect) so StrictMode's double
  // mount reuses one request instead of burning the single-use token twice.
  const verifyQuery = useQuery({
    queryKey: ["auth", "verify-email", token],
    queryFn: async () => {
      await apiClient.post("/auth/verify-email", { token });
      return true;
    },
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // Ask the server whether the signed-in user is already verified. This covers
  // links that were already used, and refetches on tab focus so verifying in
  // another tab moves this page forward on its own.
  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => (await apiClient.get("/auth/me")).data.user as MeUser,
    enabled: !!accessToken && (!token || verifyQuery.isError),
    retry: false,
    refetchOnWindowFocus: true,
  });

  const email = meQuery.data?.email ?? storedEmail;
  const isVerified = verifyQuery.isSuccess || legacyVerified || meQuery.data?.isEmailVerified === true;
  const isChecking = (!!token && verifyQuery.isPending) || meQuery.isLoading;
  const isFailed = verifyQuery.isError || legacyFailed;

  const startOver = () => {
    useAuthStore.getState().clearAuth();
    navigate(`${config.basePath}/signup`);
  };

  if (isVerified) {
    return (
      <AuthCard title="Email verified" subtitle={config.verifiedCopy}>
        <div className="flex w-full flex-col items-center gap-6">
          <img src={successAnimation} alt="" className="h-32 w-32" />
          {accessToken ? (
            <ActionButton size="lg" onClick={() => navigate(redirect ?? config.homePath)}>
              {config.homeLabel}
            </ActionButton>
          ) : (
            <ActionButton size="lg" onClick={() => navigate(`${config.basePath}/signin`)}>
              Sign in to continue
            </ActionButton>
          )}
        </div>
      </AuthCard>
    );
  }

  if (isChecking) {
    return (
      <AuthCard title="Verifying your email" subtitle="This only takes a moment.">
        <div className="flex w-full justify-center py-4">
          <img src={spinner} alt="Loading" className="h-10 w-10 animate-spin" />
        </div>
      </AuthCard>
    );
  }

  if (isFailed) {
    return (
      <AuthCard
        title="This link didn't work"
        subtitle="It may have expired or already been used. Request a fresh one and we'll email it right away."
      >
        <StatusIcon tone="error">
          <MailWarning className="h-9 w-9" aria-hidden />
        </StatusIcon>
        <ResendPanel email={email} />
        <AuthSwitchLink
          prompt="Already verified?"
          linkText="Sign in"
          to={`${config.basePath}/signin`}
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={email ? "Check your inbox" : "Verify your email"}
      subtitle={
        email
          ? `We sent a verification link to ${email}. Click it to activate your account.`
          : "Enter your email and we'll send you a verification link."
      }
    >
      <StatusIcon tone="primary">
        <Mail className="h-9 w-9" aria-hidden />
      </StatusIcon>
      <ResendPanel email={email} startInCooldown={justSent} />
      {email && (
        <p className="text-center text-sm text-neutral-500">
          Verified in another tab? This page updates on its own.
        </p>
      )}
      {accessToken ? (
        <p className="text-center text-base text-neutral-700">
          Wrong email?{" "}
          <button type="button" onClick={startOver} className="cursor-pointer text-primary-500">
            Sign up again
          </button>
        </p>
      ) : (
        <AuthSwitchLink
          prompt="Already verified?"
          linkText="Sign in"
          to={`${config.basePath}/signin`}
        />
      )}
    </AuthCard>
  );
};

export default VerifyEmailFlow;
